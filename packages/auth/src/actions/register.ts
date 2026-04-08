import { sign } from "hono/utils/jwt/jwt";
import { setCookie } from "hono/cookie";
import bcrypt from "bcrypt";
import type { Context } from "hono";

import { getDb } from "@shiftmate/database";
import { createTenant, createUser } from "@shiftmate/tenant";
import { authUsers } from "../schema/authUserSchema";

type RegisterArgs = {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
};

export const register = async (args: RegisterArgs, c: Context) => {
  const db = getDb();

  const tenant = createTenant({ name: args.restaurantName });

  const user = createUser({
    tenantId: tenant.id,
    name: args.name,
    email: args.email,
    role: "owner",
  });

  const hashedPassword = await bcrypt.hash(args.password, 10);

  db.insert(authUsers)
    .values({ userId: user.id, password: hashedPassword })
    .run();

  const TTL = Math.floor(Date.now() / 1000) + 60 * 60;

  const payload = {
    sub: user.id.toString(),
    email: user.email,
    tenantId: tenant.id,
    exp: TTL,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return { error: "JWT secret not configured" };
  }

  const token = await sign(payload, secret);

  setCookie(c, "auth_token", `Bearer ${token}`, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    expires: new Date(TTL * 1000),
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      tenantId: tenant.id,
      tenantName: tenant.name,
    },
  };
};
