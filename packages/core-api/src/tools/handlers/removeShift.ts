import type { ToolDefinition } from "@shiftmate/llm";
import { deleteShift } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "remove_shift",
  description: "Remove a specific shift from the schedule.",
  parameters: {
    type: "object",
    properties: {
      shift_id: { type: "number", description: "ID of the shift to remove" },
    },
    required: ["shift_id"],
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const shiftId = args.shift_id as number;
  const result = await deleteShift(tenantId, shiftId);
  return { removed: result[0] };
};
