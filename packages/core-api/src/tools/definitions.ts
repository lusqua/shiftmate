import { definition as listWorkers } from "./handlers/listWorkers";
import { definition as getSchedule } from "./handlers/getSchedule";
import { definition as getScheduleRules } from "./handlers/getScheduleRules";
import { definition as defineScheduleRule } from "./handlers/defineScheduleRule";
import { definition as autoFillSchedule } from "./handlers/autoFillSchedule";
import { definition as autoFillDay } from "./handlers/autoFillDay";
import { definition as swapWorker } from "./handlers/swapWorker";
import { definition as removeShift } from "./handlers/removeShift";
import { definition as getWorkerHours } from "./handlers/getWorkerHours";
import { definition as clearSchedule } from "./handlers/clearSchedule";
import { definition as clearDay } from "./handlers/clearDay";

export const toolDefinitions = [
  listWorkers,
  getSchedule,
  getScheduleRules,
  defineScheduleRule,
  autoFillSchedule,
  autoFillDay,
  swapWorker,
  removeShift,
  getWorkerHours,
  clearSchedule,
  clearDay,
];
