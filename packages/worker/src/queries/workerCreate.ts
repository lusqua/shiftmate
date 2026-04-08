import { getDb } from "@shiftmate/database";
import { workers, type NewWorker } from "../schema/workerSchema";
import { availability } from "../schema/availabilitySchema";

export const workerCreate = (
  tenantId: number,
  data: Omit<NewWorker, "tenantId">,
) => {
  const db = getDb();

  const result = db
    .insert(workers)
    .values({ ...data, tenantId })
    .returning()
    .all();
  const worker = result[0]!;

  const availRows = Array.from({ length: 7 }, (_, day) => ({
    workerId: worker.id,
    dayOfWeek: day,
    available: true,
  }));

  db.insert(availability).values(availRows).run();

  return worker;
};
