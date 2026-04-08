import type { Shift, WorkerRole } from "../../types";
import { ROLE_COLORS } from "../../types";

type Props = {
  shift: Shift;
};

export const ShiftCard = ({ shift }: Props) => {
  const colors = ROLE_COLORS[shift.role as WorkerRole];
  const isOpen = !shift.workerId;

  return (
    <div
      className={`rounded-lg border-l-3 p-2 mb-1 text-xs cursor-default transition-all hover:shadow-sm ${
        colors?.bg ?? "bg-base-200/50"
      } ${colors?.border ?? "border-base-300"} ${
        isOpen ? "border-dashed opacity-60" : ""
      }`}
      title={
        isOpen
          ? `Open: ${shift.role} ${shift.startTime}-${shift.endTime}`
          : `${shift.workerName} (${shift.role})\n${shift.startTime}-${shift.endTime}`
      }
    >
      <div
        className={`font-medium truncate ${colors?.text ?? "text-base-content/70"}`}
      >
        {isOpen ? "Open" : shift.workerName}
      </div>
      <div className="text-base-content/35 flex justify-between items-center mt-0.5">
        <span className="capitalize">{shift.role}</span>
        <span>
          {shift.startTime}–{shift.endTime}
        </span>
      </div>
    </div>
  );
};
