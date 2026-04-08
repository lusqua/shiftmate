import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { insertScheduleRule } from "@shiftmate/scheduling";

export const rulesPost = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const data = await c.req.json();

  if (
    !data.name ||
    !data.dayType ||
    !data.role ||
    !data.count ||
    !data.startTime ||
    !data.endTime
  ) {
    return c.json({ error: "All fields are required" }, 400);
  }

  const result = await insertScheduleRule(auth.tenantId, {
    name: data.name,
    dayType: data.dayType,
    role: data.role,
    count: data.count,
    startTime: data.startTime,
    endTime: data.endTime,
  });

  return c.json({ rule: result[0] }, 201);
};
