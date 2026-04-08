import { getDb } from "@shiftmate/database";
import { shifts, type NewShift } from "./shiftSchema";

export const insertShift = async (
  tenantId: number,
  data: Omit<NewShift, "tenantId">,
) => {
  const db = getDb();
  return db
    .insert(shifts)
    .values({ ...data, tenantId })
    .returning()
    .all();
};
