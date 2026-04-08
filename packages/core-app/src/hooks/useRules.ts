import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

export type ScheduleRule = {
  id: number;
  tenantId: number;
  name: string;
  dayType: string;
  role: string;
  count: number;
  startTime: string;
  endTime: string;
};

export const useRules = () => {
  const [rules, setRules] = useState<ScheduleRule[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/schedule-rules");
      setRules(data.rules ?? []);
    } catch {
      setRules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const createRule = async (data: Omit<ScheduleRule, "id" | "tenantId">) => {
    const result = await api("/schedule-rules", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (result.error) throw new Error(result.error);
    await fetchRules();
    return result.rule;
  };

  const updateRule = async (
    id: number,
    data: Partial<Omit<ScheduleRule, "id" | "tenantId">>,
  ) => {
    const result = await api(`/schedule-rules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (result.error) throw new Error(result.error);
    await fetchRules();
    return result.rule;
  };

  const deleteRule = async (id: number) => {
    const result = await api(`/schedule-rules/${id}`, { method: "DELETE" });
    if (result.error) throw new Error(result.error);
    await fetchRules();
  };

  return { rules, loading, createRule, updateRule, deleteRule };
};
