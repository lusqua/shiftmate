import { describe, expect, test } from "bun:test";
import { getMondayOfWeek } from "../getMondayOfWeek";

describe("getMondayOfWeek", () => {
  test("Monday returns itself", () => {
    expect(getMondayOfWeek("2026-04-06")).toBe("2026-04-06");
  });

  test("Tuesday returns previous Monday", () => {
    expect(getMondayOfWeek("2026-04-07")).toBe("2026-04-06");
  });

  test("Sunday returns previous Monday", () => {
    expect(getMondayOfWeek("2026-04-12")).toBe("2026-04-06");
  });

  test("Saturday returns previous Monday", () => {
    expect(getMondayOfWeek("2026-04-11")).toBe("2026-04-06");
  });

  test("Wednesday returns previous Monday", () => {
    expect(getMondayOfWeek("2026-04-08")).toBe("2026-04-06");
  });

  test("handles month boundary", () => {
    expect(getMondayOfWeek("2026-05-01")).toBe("2026-04-27"); // Friday May 1 → Monday Apr 27
  });
});
