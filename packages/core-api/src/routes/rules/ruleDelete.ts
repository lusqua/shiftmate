import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { deleteScheduleRule } from "@shiftmate/scheduling";

export const ruleDeleteHandler = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const id = Number(c.req.param("id"));

  const result = await deleteScheduleRule(auth.tenantId, id);

  if (!result[0]) {
    return c.json({ error: "Rule not found" }, 404);
  }

  return c.json({ deleted: result[0] });
};
