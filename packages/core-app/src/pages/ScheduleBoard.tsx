import { WeekView } from "../components/Calendar/WeekView";
import { useSchedule } from "../hooks/useSchedule";

export const ScheduleBoard = () => {
  const { shifts, currentWeek, loading, goNextWeek, goPrevWeek } =
    useSchedule();

  return (
    <div className="h-full">
      <WeekView
        shifts={shifts}
        currentWeek={currentWeek}
        onPrev={goPrevWeek}
        onNext={goNextWeek}
        loading={loading}
      />
    </div>
  );
};
