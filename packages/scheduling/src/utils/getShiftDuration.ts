export const getShiftDuration = (
  startTime: string,
  endTime: string,
): number => {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const hours = eh! - sh! + (em! - sm!) / 60;
  return hours > 0 ? hours : hours + 24;
};
