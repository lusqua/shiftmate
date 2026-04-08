import { Hono } from "hono";
import { cors } from "hono/cors";
import { databaseConnect } from "@shiftmate/database";
import { authMiddleware } from "@shiftmate/auth";
import { migrate } from "./migrate";
import { authRoutes } from "./routes/auth/index";
import { workerRoutes } from "./routes/workers/index";
import { scheduleRoutes } from "./routes/schedule/index";
import { rulesRoutes } from "./routes/rules/index";
import { chatRoutes } from "./routes/chat/index";
import { settingsRoutes } from "./routes/settings/index";

const app = new Hono();

databaseConnect();
migrate();

const corsOrigin =
  process.env.CORS_ORIGIN ??
  "http://localhost:3000,http://localhost:3001,http://localhost:3005";

app.use(
  "/api/*",
  cors({
    origin: corsOrigin.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);

// Public routes
app.route("/api/auth", authRoutes);
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Protected routes
app.use("/api/workers/*", authMiddleware);
app.use("/api/workers", authMiddleware);
app.use("/api/schedule/*", authMiddleware);
app.use("/api/schedule", authMiddleware);
app.use("/api/schedule-rules/*", authMiddleware);
app.use("/api/schedule-rules", authMiddleware);
app.use("/api/chat/*", authMiddleware);
app.use("/api/chat", authMiddleware);
app.use("/api/settings/*", authMiddleware);
app.use("/api/settings", authMiddleware);

app.route("/api/workers", workerRoutes);
app.route("/api/schedule", scheduleRoutes);
app.route("/api/schedule-rules", rulesRoutes);
app.route("/api/chat", chatRoutes);
app.route("/api/settings", settingsRoutes);

const port = Number(process.env.PORT ?? 3001);

export default {
  port,
  fetch: app.fetch,
};
