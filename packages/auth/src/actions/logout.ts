import type { Context } from "hono";
import { deleteCookie } from "hono/cookie";

export const logout = (c: Context) => {
  deleteCookie(c, "auth_token");
  return { message: "Successfully logged out" };
};
