import { describe, expect, test } from "bun:test";
import { addDays } from "../addDays";

describe("addDays", () => {
  test("adds positive days", () => {
    expect(addDays("2026-04-07", 1)).toBe("2026-04-08");
    expect(addDays("2026-04-07", 7)).toBe("2026-04-14");
  });

  test("subtracts negative days", () => {
    expect(addDays("2026-04-07", -1)).toBe("2026-04-06");
    expect(addDays("2026-04-07", -7)).toBe("2026-03-31");
  });

  test("crosses month boundary", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  test("crosses year boundary", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });

  test("adds zero days", () => {
    expect(addDays("2026-04-07", 0)).toBe("2026-04-07");
  });
});
