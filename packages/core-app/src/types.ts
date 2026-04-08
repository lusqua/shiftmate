export type WorkerRole =
  | "manager"
  | "chef"
  | "cook"
  | "waiter"
  | "dishwasher"
  | "host";

export type Worker = {
  id: number;
  name: string;
  role: WorkerRole;
  phone: string | null;
  maxHoursPerWeek: number;
};

export type Shift = {
  id: number;
  workerId: number | null;
  workerName: string | null;
  date: string;
  role: WorkerRole;
  startTime: string;
  endTime: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const ROLE_COLORS: Record<
  WorkerRole,
  { bg: string; border: string; text: string }
> = {
  manager: {
    bg: "bg-blue-50/70",
    border: "border-blue-300",
    text: "text-blue-700",
  },
  chef: {
    bg: "bg-rose-50/70",
    border: "border-rose-300",
    text: "text-rose-700",
  },
  cook: {
    bg: "bg-amber-50/70",
    border: "border-amber-300",
    text: "text-amber-700",
  },
  waiter: {
    bg: "bg-emerald-50/70",
    border: "border-emerald-300",
    text: "text-emerald-700",
  },
  dishwasher: {
    bg: "bg-slate-50/70",
    border: "border-slate-300",
    text: "text-slate-600",
  },
  host: {
    bg: "bg-violet-50/70",
    border: "border-violet-300",
    text: "text-violet-700",
  },
};

export const ROLE_BADGE_COLORS: Record<WorkerRole, string> = {
  manager: "badge-info",
  chef: "badge-error",
  cook: "badge-warning",
  waiter: "badge-success",
  dishwasher: "badge-neutral",
  host: "badge-secondary",
};
