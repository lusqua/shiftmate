import { useState, useEffect, type FormEvent } from "react";
import type { Worker, WorkerRole } from "../../types";
import { ROLE_BADGE_COLORS } from "../../types";

const ROLES: WorkerRole[] = [
  "manager",
  "chef",
  "cook",
  "waiter",
  "dishwasher",
  "host",
];

type Props = {
  worker: Worker | null;
  onSave: (data: {
    name: string;
    role: string;
    phone: string;
    maxHoursPerWeek: number;
  }) => Promise<void>;
  onClose: () => void;
};

export const WorkerModal = ({ worker, onSave, onClose }: Props) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("waiter");
  const [phone, setPhone] = useState("");
  const [maxHours, setMaxHours] = useState(40);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (worker) {
      setName(worker.name);
      setRole(worker.role);
      setPhone(worker.phone ?? "");
      setMaxHours(worker.maxHoursPerWeek);
    } else {
      setName("");
      setRole("waiter");
      setPhone("");
      setMaxHours(40);
    }
  }, [worker]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await onSave({ name, role, phone, maxHoursPerWeek: maxHours });
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
          {worker ? "Edit Worker" : "Add Worker"}
        </h3>

        {error && (
          <div className="rounded-lg bg-error/10 text-error text-xs p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-xs text-base-content/50 mb-1 block">
              Name
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              Phone
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="text-xs text-base-content/50 mb-1 block">
              Max Hours/Week
            </label>
            <input
              type="number"
              className="input input-bordered input-sm w-24 bg-base-200/30 border-base-300/50"
              value={maxHours}
              onChange={(e) => setMaxHours(Number(e.target.value))}
              min={1}
              max={80}
            />
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
