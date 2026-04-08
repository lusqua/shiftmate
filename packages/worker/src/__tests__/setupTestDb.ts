import { sql } from "drizzle-orm";
import { databaseConnect, resetDb } from "@shiftmate/database";

export const setupTestDb = () => {
  resetDb();
  const db = databaseConnect(":memory:");

  db.run(sql`DROP TABLE IF EXISTS availability`);
  db.run(sql`DROP TABLE IF EXISTS workers`);
  db.run(sql`DROP TABLE IF EXISTS tenants`);

  db.run(
    sql`CREATE TABLE tenants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
  );
  db.run(
    sql`CREATE TABLE workers (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER NOT NULL, name TEXT NOT NULL, role TEXT NOT NULL, phone TEXT, max_hours_per_week INTEGER NOT NULL DEFAULT 40, created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
  );
  db.run(
    sql`CREATE TABLE availability (id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id INTEGER NOT NULL, day_of_week INTEGER NOT NULL, available INTEGER NOT NULL DEFAULT 1)`,
  );

  return db;
};
