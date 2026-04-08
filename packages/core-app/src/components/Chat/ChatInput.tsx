import { useState, type FormEvent, type KeyboardEvent } from "react";

type Props = {
  onSend: (text: string) => void;
  loading: boolean;
};

export const ChatInput = ({ onSend, loading }: Props) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-3 border-t border-base-300/30"
    >
      <input
        type="text"
        className="input input-bordered input-sm flex-1 bg-base-200/30 border-base-300/50"
        placeholder="Type a command..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={loading || !text.trim()}
      >
        {loading ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
};
