import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { scheduleRules, type NewScheduleRule } from "./scheduleRuleSchema";

export const updateScheduleRule = async (
  tenantId: number,
  id: number,
  data: Partial<Omit<NewScheduleRule, "tenantId">>,
) => {
  const db = getDb();
  return db
    .update(scheduleRules)
    .set(data)
    .where(and(eq(scheduleRules.id, id), eq(scheduleRules.tenantId, tenantId)))
    .returning()
    .all();
};
