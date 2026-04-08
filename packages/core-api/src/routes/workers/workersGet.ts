import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { workerFind, workerFindWithAvailability } from "@shiftmate/worker";

export const workersGet = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const withAvailability = c.req.query("availability") === "true";

  if (withAvailability) {
    const workers = await workerFindWithAvailability(auth.tenantId);
    return c.json({ workers });
  }

  const role = c.req.query("role") ?? undefined;
  const workers = await workerFind(auth.tenantId, role ? { role } : undefined);
  return c.json({ workers });
};
