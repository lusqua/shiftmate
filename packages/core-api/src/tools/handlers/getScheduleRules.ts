import type { ToolDefinition } from "@shiftmate/llm";
import { getScheduleRules } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "get_schedule_rules",
  description:
    "Get all schedule rules that define how many workers of each role are needed for each day type and time slot.",
  parameters: { type: "object", properties: {} },
};

export const handler = async (
  _args: Record<string, unknown>,
  tenantId: number,
) => {
  const rules = await getScheduleRules(tenantId);

  return { rules };
};
