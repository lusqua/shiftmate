import { getDb } from "@shiftmate/database";
import { workers, availability } from "@shiftmate/worker";
import { eq, and, gte, lte } from "drizzle-orm";
import { scheduleRules } from "../rules/scheduleRuleSchema";
import { shifts } from "./shiftSchema";
import { addDays } from "../utils/addDays";
import { getDayOfWeek } from "../utils/getDayOfWeek";
import { isWeekend } from "../utils/isWeekend";
import { getShiftDuration } from "../utils/getShiftDuration";

type FilledShift = {
  workerId: number;
  workerName: string;
  date: string;
  role: string;
  startTime: string;
  endTime: string;
};

type UnfilledShift = {
  date: string;
  role: string;
  startTime: string;
  endTime: string;
};

type AutoFillResult = {
  filled: FilledShift[];
  unfilled: UnfilledShift[];
};

export const autoFill = async (
  tenantId: number,
  weekStart: string,
): Promise<AutoFillResult> => {
  const db = getDb();

  const allRules = await db
    .select()
    .from(scheduleRules)
    .where(eq(scheduleRules.tenantId, tenantId));
  const allWorkers = await db
    .select()
    .from(workers)
    .where(eq(workers.tenantId, tenantId));
  const allAvailability = await db.select().from(availability);

  const weekEnd = addDays(weekStart, 6);
  const existingShifts = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        gte(shifts.date, weekStart),
        lte(shifts.date, weekEnd),
      ),
    );

  const workerIds = new Set(allWorkers.map((w) => w.id));
  const tenantAvailability = allAvailability.filter((a) =>
    workerIds.has(a.workerId),
  );

  const workerHours: Map<number, number> = new Map(
    allWorkers.map((w) => [w.id, 0]),
  );

  existingShifts
    .filter((s) => s.workerId)
    .forEach((s) => {
      const current = workerHours.get(s.workerId!) ?? 0;
      workerHours.set(
        s.workerId!,
        current + getShiftDuration(s.startTime, s.endTime),
      );
    });

  const filled: FilledShift[] = [];
  const unfilled: UnfilledShift[] = [];

  Array.from({ length: 7 }, (_, i) => i).forEach((i) => {
    const date = addDays(weekStart, i);
    const dayOfWeek = getDayOfWeek(date);
    const dayType = isWeekend(date) ? "weekend" : "weekday";

    const dayRules = allRules.filter((r) => r.dayType === dayType);

    dayRules.forEach((rule) => {
      Array.from({ length: rule.count }, (_, s) => s).forEach((slot) => {
        const alreadyAssigned = [...filled, ...existingShifts].filter(
          (s) =>
            s.date === date &&
            s.role === rule.role &&
            s.startTime === rule.startTime &&
            s.endTime === rule.endTime,
        );

        if (alreadyAssigned.length > slot) return;

        const shiftDuration = getShiftDuration(rule.startTime, rule.endTime);

        const candidates = allWorkers
          .filter((w) => w.role === rule.role)
          .filter((w) => {
            const avail = tenantAvailability.find(
              (a) => a.workerId === w.id && a.dayOfWeek === dayOfWeek,
            );
            return avail ? avail.available : true;
          })
          .filter((w) => {
            const hours = workerHours.get(w.id) ?? 0;
            return hours + shiftDuration <= w.maxHoursPerWeek;
          })
          .filter((w) => {
            const alreadyWorking = [...filled, ...existingShifts].some(
              (s) =>
                ("workerId" in s ? s.workerId : undefined) === w.id &&
                s.date === date &&
                s.startTime === rule.startTime,
            );
            return !alreadyWorking;
          })
          .sort((a, b) => {
            const hoursA = workerHours.get(a.id) ?? 0;
            const hoursB = workerHours.get(b.id) ?? 0;
            return hoursA - hoursB;
          });

        const chosen = candidates[0];

        if (chosen) {
          const shiftData = {
            tenantId,
            workerId: chosen.id,
            date,
            role: rule.role,
            startTime: rule.startTime,
            endTime: rule.endTime,
          };

          db.insert(shifts).values(shiftData).run();

          filled.push({
            ...shiftData,
            workerName: chosen.name,
          });

          workerHours.set(
            chosen.id,
            (workerHours.get(chosen.id) ?? 0) + shiftDuration,
          );
        } else {
          unfilled.push({
            date,
            role: rule.role,
            startTime: rule.startTime,
            endTime: rule.endTime,
          });
        }
      });
    });
  });

  return { filled, unfilled };
};
