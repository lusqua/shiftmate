import { getDb } from "@shiftmate/database";
import { workers, availability } from "@shiftmate/worker";
import { eq, and, gte, lte } from "drizzle-orm";
import { scheduleRules } from "../rules/scheduleRuleSchema";
import { shifts } from "./shiftSchema";
import { addDays } from "../utils/addDays";
import { getShiftDuration } from "../utils/getShiftDuration";
import { getMondayOfWeek } from "../utils/getMondayOfWeek";
import { isWeekend } from "../utils/isWeekend";

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

type AutoFillDayResult = {
  filled: FilledShift[];
  unfilled: UnfilledShift[];
};

export const autoFillDay = async (
  tenantId: number,
  date: string,
): Promise<AutoFillDayResult> => {
  const db = getDb();

  const d = new Date(date + "T00:00:00");
  const dayOfWeek = d.getDay();
  const dayType = isWeekend(date) ? "weekend" : "weekday";

  const dayRules = await db
    .select()
    .from(scheduleRules)
    .where(
      and(
        eq(scheduleRules.tenantId, tenantId),
        eq(scheduleRules.dayType, dayType),
      ),
    );

  const allWorkers = await db
    .select()
    .from(workers)
    .where(eq(workers.tenantId, tenantId));
  const allAvailability = await db.select().from(availability);

  const workerIds = new Set(allWorkers.map((w) => w.id));
  const tenantAvailability = allAvailability.filter((a) =>
    workerIds.has(a.workerId),
  );

  const weekStart = getMondayOfWeek(date);
  const weekEnd = addDays(weekStart, 6);
  const weekShifts = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        gte(shifts.date, weekStart),
        lte(shifts.date, weekEnd),
      ),
    );

  const workerHours: Map<number, number> = new Map(
    allWorkers.map((w) => [w.id, 0]),
  );

  weekShifts
    .filter((s) => s.workerId)
    .forEach((s) => {
      const current = workerHours.get(s.workerId!) ?? 0;
      workerHours.set(
        s.workerId!,
        current + getShiftDuration(s.startTime, s.endTime),
      );
    });

  const existingDayShifts = weekShifts.filter((s) => s.date === date);

  const filled: FilledShift[] = [];
  const unfilled: UnfilledShift[] = [];

  dayRules.forEach((rule) => {
    Array.from({ length: rule.count }, (_, s) => s).forEach((slot) => {
      const alreadyAssigned = [...filled, ...existingDayShifts].filter(
        (s) =>
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
          const alreadyWorking = [...filled, ...existingDayShifts].some(
            (s) =>
              ("workerId" in s ? s.workerId : undefined) === w.id &&
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

        filled.push({ ...shiftData, workerName: chosen.name });

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

  return { filled, unfilled };
};
