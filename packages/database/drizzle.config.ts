import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "../worker/src/workerSchema.ts",
    "../worker/src/availabilitySchema.ts",
    "../scheduling/src/scheduleRuleSchema.ts",
    "../scheduling/src/shiftSchema.ts",
  ],
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "sqlite.db",
  },
});
