import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { updateScheduleRule } from "@shiftmate/scheduling";

export const rulePut = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const id = Number(c.req.param("id"));
  const data = await c.req.json();

  const result = await updateScheduleRule(auth.tenantId, id, data);

  if (!result[0]) {
    return c.json({ error: "Rule not found" }, 404);
  }

  return c.json({ rule: result[0] });
};
