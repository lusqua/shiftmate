import type { Shift } from "../../types";
import { ShiftCard } from "./ShiftCard";

type Props = {
  date: string;
  dayLabel: string;
  shifts: Shift[];
  isToday: boolean;
};

export const DayColumn = ({ date, dayLabel, shifts, isToday }: Props) => {
  const sorted = [...shifts].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );
  const dateNum = new Date(date + "T00:00:00").getDate();

  return (
    <div className={`flex-1 min-w-0 ${isToday ? "bg-primary/3" : ""}`}>
      <div
        className={`text-center py-2.5 border-b border-base-300/30 sticky top-0 bg-base-100 z-10`}
      >
        <div
          className={`text-xs uppercase tracking-wider ${isToday ? "text-primary font-semibold" : "text-base-content/40"}`}
        >
          {dayLabel}
        </div>
        <div
          className={`text-base mt-0.5 ${isToday ? "text-primary font-semibold" : "text-base-content/70 font-medium"}`}
        >
          {dateNum}
        </div>
      </div>
      <div
        className="p-1.5 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {sorted.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
        {sorted.length === 0 && (
          <div className="text-center text-xs text-base-content/20 py-8">
            No shifts
          </div>
        )}
      </div>
    </div>
  );
};
