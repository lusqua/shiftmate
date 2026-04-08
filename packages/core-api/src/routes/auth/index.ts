import { Hono } from "hono";
import { authMiddleware } from "@shiftmate/auth";
import { authRegisterPost } from "./authRegisterPost";
import { authLoginPost } from "./authLoginPost";
import { authLogoutPost } from "./authLogoutPost";
import { authMeGet } from "./authMeGet";

export const authRoutes = new Hono();

authRoutes.post("/register", authRegisterPost);
authRoutes.post("/login", authLoginPost);
authRoutes.post("/logout", authLogoutPost);
authRoutes.get("/me", authMiddleware, authMeGet);
