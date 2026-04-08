import type { ToolDefinition } from "@shiftmate/llm";
import { autoFillDay } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "auto_fill_day",
  description:
    "Automatically fill the schedule for a specific day (not the whole week). Uses rules and worker availability. Respects max hours per week.",
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

  return autoFillDay(tenantId, date);
};
