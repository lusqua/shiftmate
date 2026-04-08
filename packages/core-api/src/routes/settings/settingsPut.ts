import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { updateTenant } from "@shiftmate/tenant";

export const settingsPut = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const data = await c.req.json();

  if (!data.name) {
    return c.json({ error: "Name is required" }, 400);
  }

  const tenant = updateTenant(auth.tenantId, { name: data.name });

  if (!tenant) {
    return c.json({ error: "Tenant not found" }, 404);
  }

  return c.json({ tenant });
};
