import { Hono } from "hono";
import { scheduleGet } from "./scheduleGet";

export const scheduleRoutes = new Hono();

scheduleRoutes.get("/", scheduleGet);
