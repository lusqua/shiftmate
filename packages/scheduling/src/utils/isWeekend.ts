import { getDayOfWeek } from "./getDayOfWeek";

export const isWeekend = (dateStr: string): boolean => {
  const dow = getDayOfWeek(dateStr);
  return dow === 0 || dow === 6;
};
