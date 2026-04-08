import { useState, useEffect, type FormEvent } from "react";
import type { WorkerRole } from "../../types";
import { ROLE_BADGE_COLORS } from "../../types";
import type { ScheduleRule } from "../../hooks/useRules";

const ROLES: WorkerRole[] = [
  "manager",
  "chef",
  "cook",
  "waiter",
  "dishwasher",
  "host",
];
const DAY_TYPES = ["weekday", "weekend"] as const;

type Props = {
  rule: ScheduleRule | null;
  onSave: (data: Omit<ScheduleRule, "id" | "tenantId">) => Promise<void>;
  onClose: () => void;
};

export const RuleModal = ({ rule, onSave, onClose }: Props) => {
  const [name, setName] = useState("");
  const [dayType, setDayType] = useState("weekday");
  const [role, setRole] = useState<string>("waiter");
  const [count, setCount] = useState(1);
  const [startTime, setStartTime] = useState("11:00");
  const [endTime, setEndTime] = useState("15:00");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setDayType(rule.dayType);
      setRole(rule.role);
      setCount(rule.count);
      setStartTime(rule.startTime);
      setEndTime(rule.endTime);
    } else {
      setName("");
      setDayType("weekday");
      setRole("waiter");
      setCount(1);
      setStartTime("11:00");
      setEndTime("15:00");
    }
  }, [rule]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave({ name, dayType, role, count, startTime, endTime });
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative rounded-xl border border-base-300/40 shadow-lg bg-base-100 p-6 w-full max-w-md z-[101]">
        <h3 className="text-base font-semibold mb-4 text-base-content/90">
          {rule ? "Edit Rule" : "Add Rule"}
        </h3>

        {error && (
          <div className="rounded-lg bg-error/10 text-error text-xs p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-xs text-base-content/50 mb-1 block">
              Period Name
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
              placeholder="e.g. Weekday Lunch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="text-xs text-base-content/50 mb-2 block">
              Day Type
            </label>
            <div className="flex gap-2">
              {DAY_TYPES.map((dt) => (
                <button
                  key={dt}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    dayType === dt
                      ? "bg-primary text-primary-content"
                      : "bg-base-200/60 text-base-content/60 hover:bg-base-200"
                  }`}
                  onClick={() => setDayType(dt)}
                >
                  {dt.charAt(0).toUpperCase() + dt.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-base-content/50 mb-2 block">
              Role
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`badge cursor-pointer transition-all ${
                    role === r
                      ? `${ROLE_BADGE_COLORS[r]} badge-lg ring-2 ring-primary/30`
                      : "badge-ghost badge-lg opacity-40 hover:opacity-70"
                  }`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-base-content/50 mb-1 block">
              Count
            </label>
            <input
              type="number"
              className="input input-bordered input-sm w-24 bg-base-200/30 border-base-300/50"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min={1}
              max={20}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="text-xs text-base-content/50 mb-1 block">
                Start Time
              </label>
              <input
                type="time"
                className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs text-base-content/50 mb-1 block">
                End Time
              </label>
              <input
                type="time"
                className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm px-5"
              disabled={saving}
            >
              {saving ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
