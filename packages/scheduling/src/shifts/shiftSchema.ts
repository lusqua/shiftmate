import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { tenants } from "@shiftmate/tenant";
import { workers } from "@shiftmate/worker";

export const shifts = sqliteTable("shifts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenants.id),
  workerId: integer("worker_id").references(() => workers.id),
  date: text("date").notNull(),
  role: text("role").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export type Shift = typeof shifts.$inferSelect;
export type NewShift = typeof shifts.$inferInsert;
