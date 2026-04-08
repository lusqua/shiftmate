import { describe, expect, test, beforeEach } from "bun:test";
import { getDb } from "@shiftmate/database";
import { workers, availability } from "@shiftmate/worker";
import { tenants } from "@shiftmate/tenant";
import { scheduleRules } from "../../rules/scheduleRuleSchema";
import { shifts } from "../shiftSchema";
import { autoFillDay } from "../autoFillDay";
import { setupTestDb } from "./setupTestDb";

describe("autoFillDay", () => {
  beforeEach(() => {
    const db = setupTestDb();
    db.insert(tenants).values({ id: 1, name: "Test" }).run();
  });

  test("fills a single weekday", async () => {
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

    const result = await autoFillDay(1, "2026-04-07");

    expect(result.filled.length).toBe(1);
    expect(result.filled[0]?.date).toBe("2026-04-07");
    expect(result.unfilled.length).toBe(0);
  });

  test("uses weekend rules on Saturday", async () => {
    const db = getDb();
    db.insert(workers)
      .values({ id: 1, tenantId: 1, name: "Manager 1", role: "manager" })
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
        name: "Weekend Lunch",
        dayType: "weekend",
        role: "manager",
        count: 1,
        startTime: "11:00",
        endTime: "16:00",
      })
      .run();

    const result = await autoFillDay(1, "2026-04-11");

    expect(result.filled.length).toBe(1);
    expect(result.filled[0]?.role).toBe("manager");
  });

  test("does not duplicate existing shifts", async () => {
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
    db.insert(shifts)
      .values({
        tenantId: 1,
        workerId: 1,
        date: "2026-04-07",
        role: "cook",
        startTime: "11:00",
        endTime: "15:00",
      })
      .run();

    const result = await autoFillDay(1, "2026-04-07");

    expect(result.filled.length).toBe(0);
    expect(result.unfilled.length).toBe(0);
  });

  test("respects worker unavailability", async () => {
    const db = getDb();
    db.insert(workers)
      .values({ id: 1, tenantId: 1, name: "Cook 1", role: "cook" })
      .run();
    db.insert(availability)
      .values({ workerId: 1, dayOfWeek: 2, available: false })
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

    const result = await autoFillDay(1, "2026-04-07");

    expect(result.filled.length).toBe(0);
    expect(result.unfilled.length).toBe(1);
  });
});
