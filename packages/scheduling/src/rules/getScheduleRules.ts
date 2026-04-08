import { eq } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { scheduleRules, type ScheduleRule } from "./scheduleRuleSchema";

export const getScheduleRules = async (
  tenantId: number,
): Promise<ScheduleRule[]> => {
  const db = getDb();
  return db
    .select()
    .from(scheduleRules)
    .where(eq(scheduleRules.tenantId, tenantId));
};
