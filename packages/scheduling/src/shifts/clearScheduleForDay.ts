import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { shifts } from "./shiftSchema";

export const clearScheduleForDay = async (tenantId: number, date: string) => {
  const db = getDb();
  return db
    .delete(shifts)
    .where(and(eq(shifts.tenantId, tenantId), eq(shifts.date, date)))
    .returning()
    .all();
};
