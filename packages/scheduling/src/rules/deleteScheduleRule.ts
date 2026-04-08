import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { scheduleRules } from "./scheduleRuleSchema";

export const deleteScheduleRule = async (tenantId: number, id: number) => {
  const db = getDb();
  return db
    .delete(scheduleRules)
    .where(and(eq(scheduleRules.id, id), eq(scheduleRules.tenantId, tenantId)))
    .returning()
    .all();
};
