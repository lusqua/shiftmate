import type { ToolDefinition } from "@shiftmate/llm";
import { clearScheduleForDay } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "clear_day",
  description: "Clear all shifts for a specific day.",
  parameters: {
    type: "object",
    properties: {
      date: { type: "string", description: "Date in YYYY-MM-DD format" },
    },
    required: ["date"],
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const date = args.date as string;

  const removed = await clearScheduleForDay(tenantId, date);

  return { removedCount: removed.length };
};
