import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { tenants } from "@shiftmate/tenant";

export const workers = sqliteTable("workers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenantId: integer("tenant_id")
    .notNull()
    .references(() => tenants.id),
  name: text("name").notNull(),
  role: text("role").notNull(),
  phone: text("phone"),
  maxHoursPerWeek: integer("max_hours_per_week").notNull().default(40),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Worker = typeof workers.$inferSelect;
export type NewWorker = typeof workers.$inferInsert;

export type WorkerRole =
  | "manager"
  | "chef"
  | "cook"
  | "waiter"
  | "dishwasher"
  | "host";
