import type { ToolDefinition } from "@shiftmate/llm";
import { clearScheduleForWeek } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "clear_schedule",
  description: "Clear all shifts for a specific week. Use with caution.",
  parameters: {
    type: "object",
    properties: {
      week_start: {
        type: "string",
        description: "Monday date in YYYY-MM-DD format",
      },
    },
    required: ["week_start"],
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const weekStart = args.week_start as string;

  const removed = await clearScheduleForWeek(tenantId, weekStart);

  return { removedCount: removed.length };
};
