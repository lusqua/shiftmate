import type { Shift } from "../../types";
import { addDays } from "../../utils/addDays";
import { DayColumn } from "./DayColumn";

type Props = {
  shifts: Shift[];
  currentWeek: string;
  onPrev: () => void;
  onNext: () => void;
  loading: boolean;
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatWeekRange = (weekStart: string): string => {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(weekStart + "T00:00:00");
  end.setDate(end.getDate() + 6);

  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} — ${end.toLocaleDateString("en-US", opts)}, ${end.getFullYear()}`;
};

export const WeekView = ({
  shifts,
  currentWeek,
  onPrev,
  onNext,
  loading,
}: Props) => {
  const today = new Date().toLocaleDateString("sv-SE");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300/30 bg-base-100">
        <button
          className="text-base-content/40 hover:text-base-content/70 transition-colors px-2 py-1"
          onClick={onPrev}
        >
          &larr;
        </button>
        <h2 className="text-sm font-medium text-base-content/70">
          {formatWeekRange(currentWeek)}
          {loading && (
            <span className="loading loading-spinner loading-xs ml-2" />
          )}
        </h2>
        <button
          className="text-base-content/40 hover:text-base-content/70 transition-colors px-2 py-1"
          onClick={onNext}
        >
          &rarr;
        </button>
      </div>

      <div className="flex flex-1 divide-x divide-base-300/20 overflow-hidden">
        {DAY_LABELS.map((label, i) => {
          const date = addDays(currentWeek, i);
          const dayShifts = shifts.filter((s) => s.date === date);

          return (
            <DayColumn
              key={date}
              date={date}
              dayLabel={label}
              shifts={dayShifts}
              isToday={date === today}
            />
          );
        })}
      </div>
    </div>
  );
};
