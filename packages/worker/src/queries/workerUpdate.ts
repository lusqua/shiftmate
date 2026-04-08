import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { workers, type NewWorker } from "../schema/workerSchema";

export const workerUpdate = (
  tenantId: number,
  id: number,
  data: Partial<Omit<NewWorker, "tenantId">>,
) => {
  const db = getDb();
  const result = db
    .update(workers)
    .set(data)
    .where(and(eq(workers.id, id), eq(workers.tenantId, tenantId)))
    .returning()
    .all();
  return result[0];
};
