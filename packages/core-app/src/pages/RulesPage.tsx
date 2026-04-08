import { useState } from "react";
import { useRules, type ScheduleRule } from "../hooks/useRules";
import { RuleModal } from "../components/Rules/RuleModal";
import { ROLE_BADGE_COLORS, type WorkerRole } from "../types";

export const RulesPage = () => {
  const { rules, loading, createRule, updateRule, deleteRule } = useRules();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ScheduleRule | null>(null);

  const handleAdd = () => {
    setEditingRule(null);
    setModalOpen(true);
  };

  const handleEdit = (rule: ScheduleRule) => {
    setEditingRule(rule);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<ScheduleRule, "id" | "tenantId">) => {
    if (editingRule) {
      await updateRule(editingRule.id, data);
    } else {
      await createRule(data);
    }
  };

  const handleDelete = async (rule: ScheduleRule) => {
    if (confirm(`Remove rule "${rule.name} - ${rule.role}"?`)) {
      await deleteRule(rule.id);
    }
  };

  // Group rules by name + dayType + time
  const grouped = rules.reduce<Record<string, ScheduleRule[]>>((acc, rule) => {
    const key = `${rule.name}|${rule.dayType}|${rule.startTime}-${rule.endTime}`;
    acc[key] = [...(acc[key] ?? []), rule];
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-base-content/90">
            Schedule Rules
          </h2>
          <p className="text-xs text-base-content/40 mt-1">
            Define staffing requirements per period
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleAdd}>
          + Add Rule
        </button>
      </div>

      <div className="grid gap-4 max-w-3xl">
        {Object.entries(grouped).map(([key, groupRules]) => {
          const first = groupRules[0]!;
          return (
            <div
              key={key}
              className="rounded-xl bg-base-100 shadow-sm border border-base-300/40 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-base-content/80">
                    {first.name}
                  </h3>
                  <p className="text-xs text-base-content/40 mt-0.5">
                    {first.dayType === "weekday" ? "Weekdays" : "Weekends"}{" "}
                    &middot; {first.startTime} - {first.endTime}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    first.dayType === "weekend"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {first.dayType}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {groupRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center gap-2 bg-base-200/40 rounded-lg px-3 py-2 group cursor-pointer hover:bg-base-200/70 transition-colors"
                    onClick={() => handleEdit(rule)}
                  >
                    <span
                      className={`badge badge-xs ${ROLE_BADGE_COLORS[rule.role as WorkerRole] ?? "badge-neutral"}`}
                    >
                      {rule.role}
                    </span>
                    <span className="text-sm font-medium text-base-content/70">
                      &times;{rule.count}
                    </span>
                    <button
                      className="text-xs text-error/0 group-hover:text-error/50 hover:!text-error transition-colors ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(rule);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center text-base-content/30 py-16 text-sm">
            No rules configured yet. Add your first rule to define staffing
            requirements.
          </div>
        )}
      </div>

      {modalOpen && (
        <RuleModal
          rule={editingRule}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};
