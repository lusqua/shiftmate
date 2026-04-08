import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { ChatBubble } from "../Chat/ChatBubble";

type Props = {
  tenantName: string;
  userName: string;
  onLogout: () => Promise<void>;
};

export const AppLayout = ({ tenantName, userName, onLogout }: Props) => {
  return (
    <div className="flex h-screen">
      <Sidebar
        tenantName={tenantName}
        userName={userName}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      <ChatBubble />
    </div>
  );
};
