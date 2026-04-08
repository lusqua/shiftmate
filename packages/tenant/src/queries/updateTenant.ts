import { eq } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { tenants } from "../schema/tenantSchema";

export const updateTenant = (id: number, data: { name: string }) => {
  const db = getDb();
  const result = db
    .update(tenants)
    .set(data)
    .where(eq(tenants.id, id))
    .returning()
    .all();
  return result[0];
};
