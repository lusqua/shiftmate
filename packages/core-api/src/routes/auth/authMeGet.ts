import type { Context } from "hono";
import type { AuthContext } from "@shiftmate/auth";
import { findUserById } from "@shiftmate/tenant";

export const authMeGet = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const user = findUserById(auth.userId);

  if (!user) {
    return c.json({ user: null }, 401);
  }

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenantName,
    },
  });
};
