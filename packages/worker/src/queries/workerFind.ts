import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { workers, type Worker } from "../schema/workerSchema";

export const workerFind = async (
  tenantId: number,
  filters?: { role?: string },
): Promise<Worker[]> => {
  const db = getDb();

  if (filters?.role) {
    return db
      .select()
      .from(workers)
      .where(
        and(eq(workers.tenantId, tenantId), eq(workers.role, filters.role)),
      );
  }

  return db.select().from(workers).where(eq(workers.tenantId, tenantId));
};
