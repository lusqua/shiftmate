import { getDb } from "@shiftmate/database";
import { tenants, type Tenant, type NewTenant } from "../schema/tenantSchema";

export const createTenant = (data: NewTenant): Tenant => {
  const db = getDb();
  const result = db.insert(tenants).values(data).returning().all();
  return result[0]!;
};
