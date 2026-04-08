import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { findTenantById } from "@shiftmate/tenant";
import { workerFind } from "@shiftmate/worker";

export const settingsGet = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const tenant = findTenantById(auth.tenantId);

  if (!tenant) {
    return c.json({ error: "Tenant not found" }, 404);
  }

  const workers = await workerFind(auth.tenantId);
  const workersByRole = workers.reduce<Record<string, number>>((acc, w) => {
    acc[w.role] = (acc[w.role] ?? 0) + 1;
    return acc;
  }, {});

  return c.json({
    tenant: {
      id: tenant.id,
      name: tenant.name,
      createdAt: tenant.createdAt,
    },
    stats: {
      totalWorkers: workers.length,
      workersByRole,
    },
  });
};
