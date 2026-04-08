import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { workers } from "./workerSchema";

export const availability = sqliteTable("availability", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workerId: integer("worker_id")
    .notNull()
    .references(() => workers.id),
  dayOfWeek: integer("day_of_week").notNull(),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
});

export type Availability = typeof availability.$inferSelect;
export type NewAvailability = typeof availability.$inferInsert;
