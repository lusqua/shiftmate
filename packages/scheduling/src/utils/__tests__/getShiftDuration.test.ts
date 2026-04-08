import { describe, expect, test } from "bun:test";
import { getShiftDuration } from "../getShiftDuration";

describe("getShiftDuration", () => {
  test("calculates simple duration", () => {
    expect(getShiftDuration("09:00", "17:00")).toBe(8);
  });

  test("calculates lunch shift (4 hours)", () => {
    expect(getShiftDuration("11:00", "15:00")).toBe(4);
  });

  test("calculates dinner shift (5 hours)", () => {
    expect(getShiftDuration("18:00", "23:00")).toBe(5);
  });

  test("handles half hours", () => {
    expect(getShiftDuration("09:00", "13:30")).toBe(4.5);
  });

  test("handles overnight shift", () => {
    expect(getShiftDuration("22:00", "06:00")).toBe(8);
  });

  test("handles 1 hour shift", () => {
    expect(getShiftDuration("12:00", "13:00")).toBe(1);
  });
});
