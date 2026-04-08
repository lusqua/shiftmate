import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import type { Worker, WorkerRole } from "../types";

export const useWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [roleFilter, setRoleFilter] = useState<WorkerRole | "all">("all");
  const [loading, setLoading] = useState(true);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/workers");
      setWorkers(data.workers ?? []);
    } catch {
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const createWorker = async (data: {
    name: string;
    role: string;
    phone?: string;
    maxHoursPerWeek?: number;
  }) => {
    const result = await api("/workers", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.error) throw new Error(result.error);
    await fetchWorkers();
    return result.worker;
  };

  const updateWorker = async (
    id: number,
    data: Partial<{
      name: string;
      role: string;
      phone: string;
      maxHoursPerWeek: number;
    }>,
  ) => {
    const result = await api(`/workers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (result.error) throw new Error(result.error);
    await fetchWorkers();
    return result.worker;
  };

  const deleteWorker = async (id: number) => {
    const result = await api(`/workers/${id}`, { method: "DELETE" });
    if (result.error) throw new Error(result.error);
    await fetchWorkers();
  };

  const filteredWorkers =
    roleFilter === "all"
      ? workers
      : workers.filter((w) => w.role === roleFilter);

  return {
    workers: filteredWorkers,
    allWorkers: workers,
    roleFilter,
    setRoleFilter,
    loading,
    createWorker,
    updateWorker,
    deleteWorker,
  };
};
