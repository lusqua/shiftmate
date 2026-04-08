import { describe, expect, test, beforeEach } from "bun:test";
import { getDb } from "@shiftmate/database";
import { tenants } from "@shiftmate/tenant";
import { workerCreate } from "../queries/workerCreate";
import { availability } from "../schema/availabilitySchema";
import { setupTestDb } from "./setupTestDb";

describe("workerCreate", () => {
  beforeEach(() => {
    const db = setupTestDb();
    db.insert(tenants).values({ id: 1, name: "Test" }).run();
  });

  test("creates worker with correct data", () => {
    const worker = workerCreate(1, {
      name: "João",
      role: "cook",
      phone: "123",
    });

    expect(worker.name).toBe("João");
    expect(worker.role).toBe("cook");
    expect(worker.phone).toBe("123");
    expect(worker.tenantId).toBe(1);
  });

  test("defaults maxHoursPerWeek to 40", () => {
    const worker = workerCreate(1, { name: "Maria", role: "waiter" });
    expect(worker.maxHoursPerWeek).toBe(40);
  });

  test("creates 7 availability rows (one per day)", () => {
    const db = getDb();
    const worker = workerCreate(1, { name: "Pedro", role: "chef" });

    const avail = db.select().from(availability).all();

    expect(avail.length).toBe(7);
    expect(avail.every((a) => a.workerId === worker.id)).toBe(true);

    const days = avail.map((a) => a.dayOfWeek).sort();
    expect(days).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test("all availability defaults to available", () => {
    const db = getDb();
    workerCreate(1, { name: "Ana", role: "host" });

    const avail = db.select().from(availability).all();
    expect(avail.every((a) => a.available === true)).toBe(true);
  });
});
