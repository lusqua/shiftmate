import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { join } from "path";

// packages/database/src/ → 3 dirs up = monorepo root
const ROOT = join(import.meta.dir, "..", "..", "..");

const state: { db: ReturnType<typeof drizzle> | null } = { db: null };

export const databaseConnect = (dbPath?: string) => {
  if (state.db) return state.db;

  const path = dbPath ?? process.env.DATABASE_URL ?? "sqlite.db";
  const resolved =
    path === ":memory:" || path.startsWith("/") ? path : join(ROOT, path);

  const sqlite = new Database(resolved);

  sqlite.exec("PRAGMA journal_mode = WAL;");
  sqlite.exec("PRAGMA foreign_keys = ON;");

  state.db = drizzle(sqlite);

  return state.db;
};

export const getDb = () => {
  if (!state.db) {
    return databaseConnect();
  }
  return state.db;
};

export const resetDb = () => {
  state.db = null;
};
