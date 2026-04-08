import type { ToolDefinition } from "@shiftmate/llm";
import { getScheduleForWeek } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "get_schedule",
  description:
    "Get the schedule (all shifts) for a specific week. Returns shifts with worker names, roles, dates, and times.",
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

  const shifts = await getScheduleForWeek(tenantId, weekStart);

  return { shifts };
};
