import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import type { Shift } from "../types";
import { addDays } from "../utils/addDays";
import { getMondayOfCurrentWeek } from "../utils/getMondayOfCurrentWeek";

export const useSchedule = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentWeek, setCurrentWeek] = useState(getMondayOfCurrentWeek);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(async (week: string) => {
    setLoading(true);
    try {
      const data = await api(`/schedule?week=${week}`);
      setShifts(data.shifts ?? []);
    } catch {
      setShifts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule(currentWeek);
  }, [currentWeek, fetchSchedule]);

  useEffect(() => {
    const handler = () => fetchSchedule(currentWeek);
    window.addEventListener("schedule-changed", handler);
    return () => window.removeEventListener("schedule-changed", handler);
  }, [currentWeek, fetchSchedule]);

  const goNextWeek = () => setCurrentWeek((w) => addDays(w, 7));
  const goPrevWeek = () => setCurrentWeek((w) => addDays(w, -7));

  return { shifts, currentWeek, loading, goNextWeek, goPrevWeek };
};
