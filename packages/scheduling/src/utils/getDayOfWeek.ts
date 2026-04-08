export const getDayOfWeek = (dateStr: string): number => {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay();
};
