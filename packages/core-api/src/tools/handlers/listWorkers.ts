import type { ToolDefinition } from "@shiftmate/llm";
import { workerFind } from "@shiftmate/worker";

export const definition: ToolDefinition = {
  name: "list_workers",
  description:
    "List all workers, optionally filtered by role. Returns worker names, roles, phones, and max hours.",
  parameters: {
    type: "object",
    properties: {
      role: {
        type: "string",
        description:
          "Filter by role: manager, chef, cook, waiter, dishwasher, host",
        enum: ["manager", "chef", "cook", "waiter", "dishwasher", "host"],
      },
    },
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const role = args.role as string | undefined;
  const workers = await workerFind(tenantId, role ? { role } : undefined);
  return { workers };
};
