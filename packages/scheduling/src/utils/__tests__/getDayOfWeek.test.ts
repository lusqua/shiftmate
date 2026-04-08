import { describe, expect, test } from "bun:test";
import { getDayOfWeek } from "../getDayOfWeek";

describe("getDayOfWeek", () => {
  test("returns 0 for Sunday", () => {
    expect(getDayOfWeek("2026-04-12")).toBe(0);
  });

  test("returns 1 for Monday", () => {
    expect(getDayOfWeek("2026-04-06")).toBe(1);
  });

  test("returns 6 for Saturday", () => {
    expect(getDayOfWeek("2026-04-11")).toBe(6);
  });

  test("returns correct day for mid-week", () => {
    expect(getDayOfWeek("2026-04-08")).toBe(3); // Wednesday
    expect(getDayOfWeek("2026-04-10")).toBe(5); // Friday
  });
});
