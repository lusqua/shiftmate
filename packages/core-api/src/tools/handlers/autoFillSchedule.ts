import type { ToolDefinition } from "@shiftmate/llm";
import { autoFill } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "auto_fill_schedule",
  description:
    "Automatically fill the schedule for a given week based on rules and worker availability. Respects max hours per week and distributes shifts fairly.",
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

  return autoFill(tenantId, weekStart);
};
