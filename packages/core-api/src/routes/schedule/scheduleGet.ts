import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { getScheduleForWeek, getMondayOfWeek } from "@shiftmate/scheduling";

export const scheduleGet = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const week =
    c.req.query("week") ??
    getMondayOfWeek(new Date().toLocaleDateString("sv-SE"));
  const shifts = await getScheduleForWeek(auth.tenantId, week);
  return c.json({ shifts, week });
};
