import { NavLink } from "react-router-dom";

type Props = {
  tenantName: string;
  userName: string;
  onLogout: () => Promise<void>;
};

const NAV_ITEMS = [
  { to: "/app/schedule", label: "Schedule", icon: "📅" },
  { to: "/app/workers", label: "Workers", icon: "👥" },
  { to: "/app/rules", label: "Rules", icon: "📋" },
  { to: "/app/settings", label: "Settings", icon: "⚙️" },
];

export const Sidebar = ({ tenantName, userName, onLogout }: Props) => {
  return (
    <aside className="w-56 bg-base-200/60 flex flex-col h-screen border-r border-base-300/50">
      <div className="px-5 py-4 border-b border-base-300/50">
        <h1 className="text-base font-semibold tracking-tight">ShiftMate</h1>
        <p className="text-xs text-base-content/50 truncate mt-0.5">
          {tenantName}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="menu menu-sm gap-0.5 p-0">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg text-sm ${isActive ? "active font-medium" : "text-base-content/70 hover:text-base-content"}`
                }
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 py-3 border-t border-base-300/50">
        <p className="text-xs font-medium text-base-content/70 truncate">
          {userName}
        </p>
        <button
          className="text-xs text-base-content/40 hover:text-base-content/70 mt-1 transition-colors"
          onClick={onLogout}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};
