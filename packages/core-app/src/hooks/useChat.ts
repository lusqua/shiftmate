import { useState, useCallback, useEffect } from "react";
import { api } from "../api";
import type { ChatMessage } from "../types";

const STORAGE_KEY = "shiftmate-chat";

const loadMessages = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: ChatMessage[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = { role: "user", content: text };
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setLoading(true);

      try {
        const data = await api("/chat", {
          method: "POST",
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.message?.content ?? "Sorry, something went wrong.",
        };

        setMessages((prev) => [...prev, assistantMsg]);
        window.dispatchEvent(new CustomEvent("schedule-changed"));
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error connecting to the server." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { messages, sendMessage, clearMessages, loading };
};
