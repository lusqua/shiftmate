import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { shifts } from "./shiftSchema";
import { addDays } from "../utils/addDays";

export const getWorkerHoursForWeek = async (
  tenantId: number,
  workerId: number,
  weekStart: string,
): Promise<number> => {
  const db = getDb();
  const weekEnd = addDays(weekStart, 6);

  const workerShifts = await db
    .select()
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        eq(shifts.workerId, workerId),
        gte(shifts.date, weekStart),
        lte(shifts.date, weekEnd),
      ),
    );

  return workerShifts.reduce((acc, s) => {
    const [startH, startM] = s.startTime.split(":").map(Number);
    const [endH, endM] = s.endTime.split(":").map(Number);
    const hours = endH! - startH! + (endM! - startM!) / 60;
    return acc + (hours > 0 ? hours : hours + 24);
  }, 0);
};
