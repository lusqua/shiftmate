import { handler as listWorkers } from "./handlers/listWorkers";
import { handler as getSchedule } from "./handlers/getSchedule";
import { handler as getScheduleRules } from "./handlers/getScheduleRules";
import { handler as defineScheduleRule } from "./handlers/defineScheduleRule";
import { handler as autoFillSchedule } from "./handlers/autoFillSchedule";
import { handler as autoFillDay } from "./handlers/autoFillDay";
import { handler as swapWorker } from "./handlers/swapWorker";
import { handler as removeShift } from "./handlers/removeShift";
import { handler as getWorkerHours } from "./handlers/getWorkerHours";
import { handler as clearSchedule } from "./handlers/clearSchedule.ts";
import { handler as clearDay } from "./handlers/clearDay.ts";

type ToolHandler = (
  args: Record<string, unknown>,
  tenantId: number,
) => Promise<unknown>;

const toolHandlers: Record<string, ToolHandler> = {
  list_workers: listWorkers,
  get_schedule: getSchedule,
  get_schedule_rules: getScheduleRules,
  define_schedule_rule: defineScheduleRule,
  auto_fill_schedule: autoFillSchedule,
  auto_fill_day: autoFillDay,
  swap_worker: swapWorker,
  remove_shift: removeShift,
  get_worker_hours: getWorkerHours,
  clear_schedule: clearSchedule,
  clear_day: clearDay,
};

export const executeTool = async (
  name: string,
  args: Record<string, unknown>,
  tenantId: number,
): Promise<unknown> => {
  const handler = toolHandlers[name];

  if (!handler) {
    return { error: `Unknown tool: ${name}` };
  }

  return handler(args, tenantId);
};
