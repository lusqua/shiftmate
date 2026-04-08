import { eq } from "drizzle-orm";
import { getDb } from "@shiftmate/database";
import { users, type User } from "../schema/userSchema";
import { tenants } from "../schema/tenantSchema";

export const findUserByEmail = (
  email: string,
): (User & { tenantName: string }) | undefined => {
  const db = getDb();
  const result = db
    .select({
      id: users.id,
      tenantId: users.tenantId,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      tenantName: tenants.name,
    })
    .from(users)
    .innerJoin(tenants, eq(users.tenantId, tenants.id))
    .where(eq(users.email, email))
    .limit(1)
    .all();
  return result[0];
};
