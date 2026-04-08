import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { workerCreate } from "@shiftmate/worker";

export const workersPost = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const data = await c.req.json();

  if (!data.name || !data.role) {
    return c.json({ error: "Name and role are required" }, 400);
  }

  const worker = workerCreate(auth.tenantId, {
    name: data.name,
    role: data.role,
    phone: data.phone ?? null,
    maxHoursPerWeek: data.maxHoursPerWeek ?? 40,
  });

  return c.json({ worker }, 201);
};
