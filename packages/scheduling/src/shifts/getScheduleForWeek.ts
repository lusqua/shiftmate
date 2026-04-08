import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { workers } from "@shiftmate/worker";
import { shifts, type Shift } from "./shiftSchema";
import { addDays } from "../utils/addDays";

export type ShiftWithWorker = Shift & {
  workerName: string | null;
};

export const getScheduleForWeek = async (
  tenantId: number,
  weekStart: string,
): Promise<ShiftWithWorker[]> => {
  const db = getDb();
  const weekEnd = addDays(weekStart, 6);

  return db
    .select({
      id: shifts.id,
      tenantId: shifts.tenantId,
      workerId: shifts.workerId,
      date: shifts.date,
      role: shifts.role,
      startTime: shifts.startTime,
      endTime: shifts.endTime,
      workerName: workers.name,
    })
    .from(shifts)
    .leftJoin(workers, eq(shifts.workerId, workers.id))
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        gte(shifts.date, weekStart),
        lte(shifts.date, weekEnd),
      ),
    );
};
