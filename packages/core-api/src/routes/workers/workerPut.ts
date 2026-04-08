import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { workerUpdate } from "@shiftmate/worker";

export const workerPut = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const id = Number(c.req.param("id"));
  const data = await c.req.json();

  const worker = workerUpdate(auth.tenantId, id, data);

  if (!worker) {
    return c.json({ error: "Worker not found" }, 404);
  }

  return c.json({ worker });
};
