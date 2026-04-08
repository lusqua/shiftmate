import type { ToolDefinition } from "@shiftmate/llm";
import { workerFindOne } from "@shiftmate/worker";
import { getWorkerHoursForWeek } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "get_worker_hours",
  description:
    "Get the total hours a specific worker is scheduled for in a given week.",
  parameters: {
    type: "object",
    properties: {
      worker_id: { type: "number", description: "Worker ID" },
      week_start: {
        type: "string",
        description: "Monday date in YYYY-MM-DD format",
      },
    },
    required: ["worker_id", "week_start"],
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const workerId = args.worker_id as number;

  const weekStart = args.week_start as string;

  const hours = await getWorkerHoursForWeek(tenantId, workerId, weekStart);

  const worker = await workerFindOne(tenantId, workerId);

  return { worker: worker?.name, hours, maxHours: worker?.maxHoursPerWeek };
};
