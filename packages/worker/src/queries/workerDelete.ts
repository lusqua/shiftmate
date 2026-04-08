import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { workers } from "../schema/workerSchema";
import { availability } from "../schema/availabilitySchema";

export const workerDelete = (tenantId: number, id: number) => {
  const db = getDb();

  db.delete(availability).where(eq(availability.workerId, id)).run();

  const result = db
    .delete(workers)
    .where(and(eq(workers.id, id), eq(workers.tenantId, tenantId)))
    .returning()
    .all();

  return result[0];
};
