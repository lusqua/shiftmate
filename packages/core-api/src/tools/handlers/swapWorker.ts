import type { ToolDefinition } from "@shiftmate/llm";
import { workerFind, workerFindOne } from "@shiftmate/worker";
import { getScheduleForWeek, updateShift } from "@shiftmate/scheduling";

export const definition: ToolDefinition = {
  name: "swap_worker",
  description:
    "Swap a worker in a specific shift. Can replace with a specific worker or automatically find the best available replacement.",
  parameters: {
    type: "object",
    properties: {
      shift_id: { type: "number", description: "ID of the shift to modify" },
      new_worker_id: {
        type: "number",
        description:
          "ID of the new worker. If omitted, auto-selects best available.",
      },
    },
    required: ["shift_id"],
  },
};

export const handler = async (
  args: Record<string, unknown>,
  tenantId: number,
) => {
  const shiftId = args.shift_id as number;
  const newWorkerId = args.new_worker_id as number | undefined;

  if (newWorkerId) {
    const result = await updateShift(tenantId, shiftId, {
      workerId: newWorkerId,
    });
    const worker = await workerFindOne(tenantId, newWorkerId);
    return { shift: result[0], newWorker: worker };
  }

  const currentShifts = await getScheduleForWeek(
    tenantId,
    (args as any).week_start ?? new Date().toLocaleDateString("sv-SE"),
  );
  const currentShift = currentShifts.find((s) => s.id === shiftId);

  if (!currentShift) {
    return { error: "Shift not found" };
  }

  const candidates = await workerFind(tenantId, { role: currentShift.role });
  const assignedWorkerIds = currentShifts
    .filter(
      (s) =>
        s.date === currentShift.date && s.startTime === currentShift.startTime,
    )
    .map((s) => s.workerId)
    .filter(Boolean);

  const available = candidates.filter((w) => !assignedWorkerIds.includes(w.id));

  if (available.length === 0) {
    return { error: "No available workers for this role and time" };
  }

  const chosen = available[0]!;
  const result = await updateShift(tenantId, shiftId, { workerId: chosen.id });
  return { shift: result[0], newWorker: chosen };
};
