import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

type Props = {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  onClear?: () => void;
  loading: boolean;
  onClose?: () => void;
};

export const ChatPanel = ({
  messages,
  onSend,
  onClear,
  loading,
  onClose,
}: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-300/30">
        <h3 className="text-sm font-medium text-base-content/70">
          ShiftMate AI
        </h3>
        <div className="flex items-center gap-2">
          {onClear && messages.length > 0 && (
            <button
              className="text-base-content/30 hover:text-base-content/60 transition-colors text-xs"
              onClick={onClear}
              title="Clear chat"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              className="text-base-content/30 hover:text-base-content/60 transition-colors text-xs"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1">
        {messages.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-sm text-base-content/40 mb-2">
              Ask me anything!
            </p>
            <p className="text-xs text-base-content/25">
              Try: "fill the schedule for next week"
              <br />
              or "who is available Saturday night?"
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="chat chat-start">
            <div className="chat-bubble chat-bubble-neutral text-sm">
              <span className="loading loading-dots loading-xs" />
            </div>
          </div>
        )}
      </div>

      <ChatInput onSend={onSend} loading={loading} />
    </div>
  );
};
