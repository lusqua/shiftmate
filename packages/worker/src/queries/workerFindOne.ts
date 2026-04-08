import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { workers, type Worker } from "../schema/workerSchema";

export const workerFindOne = async (
  tenantId: number,
  id: number,
): Promise<Worker | undefined> => {
  const db = getDb();
  const result = await db
    .select()
    .from(workers)
    .where(and(eq(workers.id, id), eq(workers.tenantId, tenantId)))
    .limit(1);
  return result[0];
};
