import { eq, and } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { shifts } from "./shiftSchema";

export const deleteShift = async (tenantId: number, id: number) => {
  const db = getDb();
  return db
    .delete(shifts)
    .where(and(eq(shifts.id, id), eq(shifts.tenantId, tenantId)))
    .returning()
    .all();
};
