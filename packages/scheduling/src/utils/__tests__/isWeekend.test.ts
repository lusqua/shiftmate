import { describe, expect, test } from "bun:test";
import { isWeekend } from "../isWeekend";

describe("isWeekend", () => {
  test("Saturday is weekend", () => {
    expect(isWeekend("2026-04-11")).toBe(true);
  });

  test("Sunday is weekend", () => {
    expect(isWeekend("2026-04-12")).toBe(true);
  });

  test("Monday is not weekend", () => {
    expect(isWeekend("2026-04-06")).toBe(false);
  });

  test("Friday is not weekend", () => {
    expect(isWeekend("2026-04-10")).toBe(false);
  });

  test("Wednesday is not weekend", () => {
    expect(isWeekend("2026-04-08")).toBe(false);
  });
});
