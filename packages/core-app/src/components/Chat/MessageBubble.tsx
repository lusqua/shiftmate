import Markdown from "react-markdown";
import type { ChatMessage } from "../../types";

type Props = {
  message: ChatMessage;
};

export const MessageBubble = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble text-sm ${
          isUser ? "chat-bubble-primary" : "chat-bubble-neutral"
        }`}
      >
        {isUser ? (
          message.content
        ) : (
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-lg font-bold mt-2 mb-1">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-bold mt-1 mb-0.5">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-1.5 last:mb-0">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-4 mb-1.5">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 mb-1.5">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-bold">{children}</strong>
              ),
              hr: () => <hr className="my-2 border-current opacity-20" />,
              table: ({ children }) => (
                <table className="table table-xs my-1.5">{children}</table>
              ),
              th: ({ children }) => <th className="font-bold">{children}</th>,
            }}
          >
            {message.content}
          </Markdown>
        )}
      </div>
    </div>
  );
};
