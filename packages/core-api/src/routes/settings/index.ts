import { Hono } from "hono";
import { settingsGet } from "./settingsGet";
import { settingsPut } from "./settingsPut";

export const settingsRoutes = new Hono();

settingsRoutes.get("/", settingsGet);
settingsRoutes.put("/", settingsPut);
