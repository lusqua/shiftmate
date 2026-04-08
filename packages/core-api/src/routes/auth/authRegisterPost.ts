import type { Context } from "hono";
import { register } from "@shiftmate/auth";

export const authRegisterPost = async (c: Context) => {
  const body = await c.req.json();
  const { name, email, password, restaurantName } = body;

  if (!name || !email || !password || !restaurantName) {
    return c.json({ error: "All fields are required" }, 400);
  }

  try {
    const result = await register({ name, email, password, restaurantName }, c);

    if ("error" in result) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result);
  } catch (err: any) {
    if (err.message?.includes("UNIQUE")) {
      return c.json({ error: "Email already registered" }, 409);
    }
    return c.json({ error: "Registration failed" }, 500);
  }
};
