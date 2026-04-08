import type { Context } from "hono";
import { login } from "@shiftmate/auth";

export const authLoginPost = async (c: Context) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const result = await login({ email, password }, c);

  if ("error" in result) {
    return c.json({ error: result.error }, 401);
  }

  return c.json(result);
};
