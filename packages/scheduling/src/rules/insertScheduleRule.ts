import { getDb } from "@shiftmate/database";
import { scheduleRules, type NewScheduleRule } from "./scheduleRuleSchema";

export const insertScheduleRule = async (
  tenantId: number,
  data: Omit<NewScheduleRule, "tenantId">,
) => {
  const db = getDb();
  return db
    .insert(scheduleRules)
    .values({ ...data, tenantId })
    .returning()
    .all();
};
