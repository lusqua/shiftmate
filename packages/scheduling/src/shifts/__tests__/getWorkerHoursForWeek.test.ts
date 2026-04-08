import { describe, expect, test, beforeEach } from "bun:test";
import { getDb } from "@shiftmate/database";
import { workers } from "@shiftmate/worker";
import { tenants } from "@shiftmate/tenant";
import { shifts } from "../shiftSchema";
import { getWorkerHoursForWeek } from "../getWorkerHoursForWeek";
import { setupTestDb } from "./setupTestDb";

describe("getWorkerHoursForWeek", () => {
  beforeEach(() => {
    const db = setupTestDb();
    db.insert(tenants).values({ id: 1, name: "Test" }).run();
    db.insert(workers)
      .values({ id: 1, tenantId: 1, name: "Cook 1", role: "cook" })
      .run();
  });

  test("returns 0 when no shifts", async () => {
    const hours = await getWorkerHoursForWeek(1, 1, "2026-04-06");
    expect(hours).toBe(0);
  });

  test("calculates hours for single shift", async () => {
    const db = getDb();
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

    const hours = await getWorkerHoursForWeek(1, 1, "2026-04-06");
    expect(hours).toBe(4);
  });

  test("sums multiple shifts in same week", async () => {
    const db = getDb();
    db.insert(shifts)
      .values([
        {
          tenantId: 1,
          workerId: 1,
          date: "2026-04-07",
          role: "cook",
          startTime: "11:00",
          endTime: "15:00",
        },
        {
          tenantId: 1,
          workerId: 1,
          date: "2026-04-08",
          role: "cook",
          startTime: "18:00",
          endTime: "23:00",
        },
      ])
      .run();

    const hours = await getWorkerHoursForWeek(1, 1, "2026-04-06");
    expect(hours).toBe(9);
  });

  test("ignores shifts outside the week", async () => {
    const db = getDb();
    db.insert(shifts)
      .values([
        {
          tenantId: 1,
          workerId: 1,
          date: "2026-04-07",
          role: "cook",
          startTime: "11:00",
          endTime: "15:00",
        },
        {
          tenantId: 1,
          workerId: 1,
          date: "2026-04-14",
          role: "cook",
          startTime: "11:00",
          endTime: "15:00",
        },
      ])
      .run();

    const hours = await getWorkerHoursForWeek(1, 1, "2026-04-06");
    expect(hours).toBe(4);
  });

  test("ignores shifts from other tenants", async () => {
    const db = getDb();
    db.insert(tenants).values({ id: 2, name: "Other" }).run();
    db.insert(shifts)
      .values([
        {
          tenantId: 1,
          workerId: 1,
          date: "2026-04-07",
          role: "cook",
          startTime: "11:00",
          endTime: "15:00",
        },
        {
          tenantId: 2,
          workerId: 1,
          date: "2026-04-07",
          role: "cook",
          startTime: "18:00",
          endTime: "23:00",
        },
      ])
      .run();

    const hours = await getWorkerHoursForWeek(1, 1, "2026-04-06");
    expect(hours).toBe(4);
  });

  test("handles half-hour shifts", async () => {
    const db = getDb();
    db.insert(shifts)
      .values({
        tenantId: 1,
        workerId: 1,
        date: "2026-04-07",
        role: "cook",
        startTime: "09:00",
        endTime: "13:30",
      })
      .run();

    const hours = await getWorkerHoursForWeek(1, 1, "2026-04-06");
    expect(hours).toBe(4.5);
  });
});
