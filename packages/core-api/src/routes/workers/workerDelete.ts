import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { workerDelete } from "@shiftmate/worker";

export const workerDeleteHandler = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const id = Number(c.req.param("id"));

  const worker = workerDelete(auth.tenantId, id);

  if (!worker) {
    return c.json({ error: "Worker not found" }, 404);
  }

  return c.json({ deleted: worker });
};
