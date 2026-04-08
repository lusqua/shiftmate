import { describe, expect, test, beforeEach } from "bun:test";
import { getDb } from "@shiftmate/database";
import { workers, availability } from "@shiftmate/worker";
import { tenants } from "@shiftmate/tenant";
import { scheduleRules } from "../../rules/scheduleRuleSchema";
import { shifts } from "../shiftSchema";
import { autoFill } from "../autoFill";
import { setupTestDb } from "./setupTestDb";

describe("autoFill", () => {
  beforeEach(() => {
    const db = setupTestDb();
    db.insert(tenants).values({ id: 1, name: "Test" }).run();
  });

  test("returns empty when no rules", async () => {
    const result = await autoFill(1, "2026-04-06");
    expect(result.filled.length).toBe(0);
    expect(result.unfilled.length).toBe(0);
  });

  test("fills shifts when workers available", async () => {
    const db = getDb();
    db.insert(workers)
      .values({ id: 1, tenantId: 1, name: "Cook 1", role: "cook" })
      .run();
    db.insert(availability)
      .values(
        Array.from({ length: 7 }, (_, day) => ({
          workerId: 1,
          dayOfWeek: day,
          available: true,
        })),
      )
      .run();
    db.insert(scheduleRules)
      .values({
        tenantId: 1,
        name: "Weekday Lunch",
        dayType: "weekday",
        role: "cook",
        count: 1,
        startTime: "11:00",
        endTime: "15:00",
      })
      .run();

    const result = await autoFill(1, "2026-04-06");

    expect(result.filled.length).toBe(5);
    expect(result.unfilled.length).toBe(0);
    expect(result.filled.every((s) => s.role === "cook")).toBe(true);
  });

  test("reports unfilled when not enough workers", async () => {
    const db = getDb();
    db.insert(scheduleRules)
      .values({
        tenantId: 1,
        name: "Weekday Lunch",
        dayType: "weekday",
        role: "cook",
        count: 2,
        startTime: "11:00",
        endTime: "15:00",
      })
      .run();

    const result = await autoFill(1, "2026-04-06");

    expect(result.filled.length).toBe(0);
    expect(result.unfilled.length).toBe(10);
  });

  test("respects max hours per week", async () => {
    const db = getDb();
    db.insert(workers)
      .values({
        id: 1,
        tenantId: 1,
        name: "Cook 1",
        role: "cook",
        maxHoursPerWeek: 8,
      })
      .run();
    db.insert(availability)
      .values(
        Array.from({ length: 7 }, (_, day) => ({
          workerId: 1,
          dayOfWeek: day,
          available: true,
        })),
      )
      .run();
    db.insert(scheduleRules)
      .values({
        tenantId: 1,
        name: "Weekday Lunch",
        dayType: "weekday",
        role: "cook",
        count: 1,
        startTime: "11:00",
        endTime: "16:00",
      })
      .run();

    const result = await autoFill(1, "2026-04-06");

    expect(result.filled.length).toBe(1);
    expect(result.unfilled.length).toBe(4);
  });

  test("respects availability", async () => {
    const db = getDb();
    db.insert(workers)
      .values({ id: 1, tenantId: 1, name: "Cook 1", role: "cook" })
      .run();
    db.insert(availability)
      .values([
        { workerId: 1, dayOfWeek: 1, available: true },
        { workerId: 1, dayOfWeek: 2, available: true },
        { workerId: 1, dayOfWeek: 3, available: false },
        { workerId: 1, dayOfWeek: 4, available: false },
        { workerId: 1, dayOfWeek: 5, available: false },
        { workerId: 1, dayOfWeek: 6, available: false },
        { workerId: 1, dayOfWeek: 0, available: false },
      ])
      .run();
    db.insert(scheduleRules)
      .values({
        tenantId: 1,
        name: "Weekday Lunch",
        dayType: "weekday",
        role: "cook",
        count: 1,
        startTime: "11:00",
        endTime: "15:00",
      })
      .run();

    const result = await autoFill(1, "2026-04-06");

    expect(result.filled.length).toBe(2);
    expect(result.unfilled.length).toBe(3);
  });

  test("distributes shifts fairly across workers", async () => {
    const db = getDb();
    db.insert(workers)
      .values([
        { id: 1, tenantId: 1, name: "Cook 1", role: "cook" },
        { id: 2, tenantId: 1, name: "Cook 2", role: "cook" },
      ])
      .run();
    db.insert(availability)
      .values([
        ...Array.from({ length: 7 }, (_, day) => ({
          workerId: 1,
          dayOfWeek: day,
          available: true,
        })),
        ...Array.from({ length: 7 }, (_, day) => ({
          workerId: 2,
          dayOfWeek: day,
          available: true,
        })),
      ])
      .run();
    db.insert(scheduleRules)
      .values({
        tenantId: 1,
        name: "Weekday Lunch",
        dayType: "weekday",
        role: "cook",
        count: 1,
        startTime: "11:00",
        endTime: "15:00",
      })
      .run();

    const result = await autoFill(1, "2026-04-06");

    const cook1 = result.filled.filter((s) => s.workerName === "Cook 1").length;
    const cook2 = result.filled.filter((s) => s.workerName === "Cook 2").length;

    expect(Math.abs(cook1 - cook2)).toBeLessThanOrEqual(1);
  });

  test("isolates tenants", async () => {
    const db = getDb();
    db.insert(tenants).values({ id: 2, name: "Other" }).run();
    db.insert(workers)
      .values({ id: 1, tenantId: 2, name: "Other Cook", role: "cook" })
      .run();
    db.insert(availability)
      .values(
        Array.from({ length: 7 }, (_, day) => ({
          workerId: 1,
          dayOfWeek: day,
          available: true,
        })),
      )
      .run();
    db.insert(scheduleRules)
      .values({
        tenantId: 1,
        name: "Weekday Lunch",
        dayType: "weekday",
        role: "cook",
        count: 1,
        startTime: "11:00",
        endTime: "15:00",
      })
      .run();

    const result = await autoFill(1, "2026-04-06");

    expect(result.filled.length).toBe(0);
    expect(result.unfilled.length).toBe(5);
  });
});
