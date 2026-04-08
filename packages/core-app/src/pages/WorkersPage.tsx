import { useState } from "react";
import { useWorkers } from "../hooks/useWorkers";
import { WorkerModal } from "../components/Workers/WorkerModal";
import { ROLE_BADGE_COLORS, type Worker, type WorkerRole } from "../types";

const ROLES: (WorkerRole | "all")[] = [
  "all",
  "manager",
  "chef",
  "cook",
  "waiter",
  "dishwasher",
  "host",
];

export const WorkersPage = () => {
  const {
    workers,
    roleFilter,
    setRoleFilter,
    loading,
    createWorker,
    updateWorker,
    deleteWorker,
  } = useWorkers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const handleAdd = () => {
    setEditingWorker(null);
    setModalOpen(true);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setModalOpen(true);
  };

  const handleSave = async (data: {
    name: string;
    role: string;
    phone: string;
    maxHoursPerWeek: number;
  }) => {
    if (editingWorker) {
      await updateWorker(editingWorker.id, data);
    } else {
      await createWorker(data);
    }
  };

  const handleDelete = async (worker: Worker) => {
    if (confirm(`Remove ${worker.name}?`)) {
      await deleteWorker(worker.id);
    }
  };

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-base-content/90">Workers</h2>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          + Add Worker
        </button>
      </div>

      <div className="flex gap-1 mb-5">
        {ROLES.map((role) => (
          <button
            key={role}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              roleFilter === role
                ? "bg-primary text-primary-content"
                : "bg-base-200/60 text-base-content/60 hover:bg-base-200 hover:text-base-content/80"
            }`}
            onClick={() => setRoleFilter(role)}
          >
            {role === "all"
              ? "All"
              : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : (
        <div className="rounded-xl bg-base-100 shadow-sm border border-base-300/40 overflow-hidden">
          <table className="table table-sm">
            <thead>
              <tr className="border-b border-base-300/40">
                <th className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-xs font-medium text-base-content/50 uppercase tracking-wider">
                  Max Hours
                </th>
                <th className="text-xs font-medium text-base-content/50 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr
                  key={worker.id}
                  className="border-b border-base-300/20 hover:bg-base-200/30 transition-colors"
                >
                  <td className="font-medium text-sm">{worker.name}</td>
                  <td>
                    <span
                      className={`badge badge-xs ${ROLE_BADGE_COLORS[worker.role]}`}
                    >
                      {worker.role}
                    </span>
                  </td>
                  <td className="text-sm text-base-content/50">
                    {worker.phone ?? "—"}
                  </td>
                  <td className="text-sm text-base-content/60">
                    {worker.maxHoursPerWeek}h
                  </td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <button
                        className="text-xs text-base-content/40 hover:text-base-content/70 transition-colors"
                        onClick={() => handleEdit(worker)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs text-error/50 hover:text-error transition-colors"
                        onClick={() => handleDelete(worker)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-base-content/30 py-12 text-sm"
                  >
                    No workers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <WorkerModal
          worker={editingWorker}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
