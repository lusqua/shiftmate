import { describe, expect, test, beforeEach } from "bun:test";
import { getDb } from "@shiftmate/database";
import { tenants } from "@shiftmate/tenant";
import { workerCreate } from "../queries/workerCreate";
import { workerDelete } from "../queries/workerDelete";
import { availability } from "../schema/availabilitySchema";
import { workers } from "../schema/workerSchema";
import { setupTestDb } from "./setupTestDb";

describe("workerDelete", () => {
  beforeEach(() => {
    const db = setupTestDb();
    db.insert(tenants)
      .values([
        { id: 1, name: "Test" },
        { id: 2, name: "Other" },
      ])
      .run();
  });

  test("deletes worker and returns it", () => {
    const worker = workerCreate(1, { name: "João", role: "cook" });
    const deleted = workerDelete(1, worker.id);

    expect(deleted?.name).toBe("João");
  });

  test("removes availability rows", () => {
    const db = getDb();
    const worker = workerCreate(1, { name: "Maria", role: "waiter" });

    expect(db.select().from(availability).all().length).toBe(7);

    workerDelete(1, worker.id);

    expect(db.select().from(availability).all().length).toBe(0);
  });

  test("does not delete worker from another tenant", () => {
    const db = getDb();
    const worker = workerCreate(1, { name: "Pedro", role: "chef" });
    const deleted = workerDelete(2, worker.id);

    expect(deleted).toBeUndefined();
    expect(db.select().from(workers).all().length).toBe(1);
  });

  test("returns undefined for non-existent worker", () => {
    const deleted = workerDelete(1, 999);
    expect(deleted).toBeUndefined();
  });
});
