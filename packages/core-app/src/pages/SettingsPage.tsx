import { useState, useEffect, type FormEvent } from "react";
import { api } from "../api";
import { ROLE_BADGE_COLORS, type WorkerRole } from "../types";

type TenantSettings = {
  tenant: { id: number; name: string; createdAt: string };
  stats: { totalWorkers: number; workersByRole: Record<string, number> };
};

export const SettingsPage = () => {
  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/settings").then((data) => {
      setSettings(data);
      setName(data.tenant.name);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      const data = await api("/settings", {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      setSettings((prev) => (prev ? { ...prev, tenant: data.tenant } : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-auto max-w-2xl">
      <h2 className="text-xl font-semibold mb-6 text-base-content/90">
        Settings
      </h2>

      <div className="rounded-xl bg-base-100 shadow-sm border border-base-300/40 p-6 mb-5">
        <h3 className="text-sm font-semibold text-base-content/80 mb-4">
          Restaurant
        </h3>
        <form onSubmit={handleSave} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-base-content/50 mb-1 block">
              Name
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full bg-base-200/30 border-base-300/50 focus:border-primary/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm px-5"
            disabled={saving}
          >
            {saving ? (
              <span className="loading loading-spinner loading-xs" />
            ) : saved ? (
              "Saved!"
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>

      {settings && (
        <div className="rounded-xl bg-base-100 shadow-sm border border-base-300/40 p-6">
          <h3 className="text-sm font-semibold text-base-content/80 mb-1">
            Team Overview
          </h3>
          <p className="text-xs text-base-content/40 mb-4">
            {settings.stats.totalWorkers} workers total
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(settings.stats.workersByRole).map(
              ([role, count]) => (
                <div
                  key={role}
                  className="flex items-center gap-1.5 bg-base-200/50 rounded-lg px-3 py-1.5"
                >
                  <span
                    className={`badge badge-xs ${ROLE_BADGE_COLORS[role as WorkerRole] ?? "badge-neutral"}`}
                  >
                    {role}
                  </span>
                  <span className="text-xs font-medium text-base-content/60">
                    {count as number}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
