import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { shifts, type NewShift } from "./shiftSchema";

export const updateShift = async (
  tenantId: number,
  id: number,
  data: Partial<Omit<NewShift, "tenantId">>,
) => {
  const db = getDb();
  return db
    .update(shifts)
    .set(data)
    .where(and(eq(shifts.id, id), eq(shifts.tenantId, tenantId)))
    .returning()
    .all();
};
