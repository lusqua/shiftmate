import type { ToolDefinition } from "@shiftmate/llm";
import { insertScheduleRule } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "define_schedule_rule",
  description:
    "Create or update a schedule rule. Defines how many workers of a specific role are needed for a day type (weekday/weekend) and time slot.",
  parameters: {
    type: "object",
    properties: {
      name: { type: "string", description: "Rule name, e.g. 'Weekend Dinner'" },
      day_type: {
        type: "string",
        enum: ["weekday", "weekend"],
        description: "Type of day",
      },
      role: {
        type: "string",
        enum: ["manager", "chef", "cook", "waiter", "dishwasher", "host"],
      },
      count: { type: "number", description: "Number of workers needed" },
      start_time: {
        type: "string",
        description: "Shift start time in HH:MM format",
      },
      end_time: {
        type: "string",
        description: "Shift end time in HH:MM format",
      },
    },
    required: ["name", "day_type", "role", "count", "start_time", "end_time"],
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const result = await insertScheduleRule(tenantId, {
    name: args.name as string,
    dayType: args.day_type as string,
    role: args.role as string,
    count: args.count as number,
    startTime: args.start_time as string,
    endTime: args.end_time as string,
  });

  return { rule: result[0] };
};
