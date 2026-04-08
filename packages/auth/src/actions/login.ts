import { sign } from "hono/utils/jwt/jwt";
import { setCookie } from "hono/cookie";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { Context } from "hono";

import { getDb } from "@shiftmate/database";
import { findUserByEmail } from "@shiftmate/tenant";
import { authUsers } from "../schema/authUserSchema";

type LoginArgs = {
  email: string;
  password: string;
};

export const login = async (args: LoginArgs, c: Context) => {
  const db = getDb();
  const user = findUserByEmail(args.email);

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const authUserResults = db
    .select()
    .from(authUsers)
    .where(eq(authUsers.userId, user.id))
    .limit(1)
    .all();

  const authUser = authUserResults[0];

  if (!authUser) {
    return { error: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(args.password, authUser.password);

  if (!isMatch) {
    return { error: "Invalid email or password" };
  }

  const TTL = Math.floor(Date.now() / 1000) + 60 * 60;

  const payload = {
    sub: user.id.toString(),
    email: user.email,
    tenantId: user.tenantId,
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
      tenantId: user.tenantId,
      tenantName: user.tenantName,
    },
  };
};
