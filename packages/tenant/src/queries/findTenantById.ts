import { eq } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { tenants, type Tenant } from "../schema/tenantSchema";

export const findTenantById = (id: number): Tenant | undefined => {
  const db = getDb();
  const result = db
    .select()
    .from(tenants)
    .where(eq(tenants.id, id))
    .limit(1)
    .all();
  return result[0];
};
