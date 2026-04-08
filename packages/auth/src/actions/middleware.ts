import { Jwt } from "hono/utils/jwt";
import { getCookie } from "hono/cookie";
import type { Context, Next } from "hono";

export type AuthContext = {
  userId: number;
  tenantId: number;
  email: string;
};

export const authMiddleware = async (c: Context, next: Next) => {
  const cookie = getCookie(c, "auth_token");

  if (!cookie) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = cookie.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return c.json({ error: "Server configuration error" }, 500);
  }

  try {
    const payload = await Jwt.verify(token!, secret, "HS256");

    const auth: AuthContext = {
      userId: Number(payload.sub),
      tenantId: Number(payload.tenantId),
      email: String(payload.email),
    };

    c.set("auth", auth);
    await next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
};
