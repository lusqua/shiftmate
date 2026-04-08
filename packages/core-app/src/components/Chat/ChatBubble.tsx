import { useState } from "react";
import { ChatPanel } from "./ChatPanel";
import { useChat } from "../../hooks/useChat";

export const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, clearMessages, loading } = useChat();

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] rounded-2xl shadow-xl border border-base-300/40 bg-base-100 overflow-hidden z-50 flex flex-col">
          <ChatPanel
            messages={messages}
            onSend={sendMessage}
            onClear={clearMessages}
            loading={loading}
            onClose={() => setOpen(false)}
          />
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-primary-content shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center z-50"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <span className="text-lg">✕</span>
        ) : (
          <span className="text-lg">💬</span>
        )}
      </button>
    </>
  );
};
