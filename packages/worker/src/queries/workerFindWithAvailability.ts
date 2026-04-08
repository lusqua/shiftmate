import { eq } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { workers, type Worker } from "../schema/workerSchema";
import { availability } from "../schema/availabilitySchema";

export type WorkerWithAvailability = Worker & {
  availability: { dayOfWeek: number; available: boolean }[];
};

export const workerFindWithAvailability = async (
  tenantId: number,
): Promise<WorkerWithAvailability[]> => {
  const db = getDb();

  const allWorkers = await db
    .select()
    .from(workers)
    .where(eq(workers.tenantId, tenantId));

  const allAvailability =
    allWorkers.length > 0 ? await db.select().from(availability) : [];

  return allWorkers.map((w) => ({
    ...w,
    availability: allAvailability
      .filter((a) => a.workerId === w.id)
      .map((a) => ({ dayOfWeek: a.dayOfWeek, available: a.available })),
  }));
};
