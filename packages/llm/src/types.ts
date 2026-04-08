export type ChatMessage = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export interface LLMProvider {
  chat(messages: ChatMessage[], tools: ToolDefinition[]): Promise<ChatMessage>;
}
