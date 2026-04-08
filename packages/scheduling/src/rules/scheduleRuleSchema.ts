import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { tenants } from "@shiftmate/tenant";

export const scheduleRules = sqliteTable("schedule_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenants.id),
  name: text("name").notNull(),
  dayType: text("day_type").notNull(),
  role: text("role").notNull(),
  count: integer("count").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export type ScheduleRule = typeof scheduleRules.$inferSelect;
export type NewScheduleRule = typeof scheduleRules.$inferInsert;
