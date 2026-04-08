import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { getScheduleRules } from "@shiftmate/scheduling";

export const rulesGet = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const rules = await getScheduleRules(auth.tenantId);
  return c.json({ rules });
};
