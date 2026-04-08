import type { Context } from "hono";
import { logout } from "@shiftmate/auth";

export const authLogoutPost = (c: Context) => {
  const result = logout(c);
  return c.json(result);
};
