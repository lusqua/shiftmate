import { eq, and, gte, lte } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { shifts } from "./shiftSchema";
import { addDays } from "../utils/addDays";

export const clearScheduleForWeek = async (
  tenantId: number,
  weekStart: string,
) => {
  const db = getDb();
  const weekEnd = addDays(weekStart, 6);
  return db
    .delete(shifts)
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        gte(shifts.date, weekStart),
        lte(shifts.date, weekEnd),
      ),
    )
    .returning()
    .all();
};
