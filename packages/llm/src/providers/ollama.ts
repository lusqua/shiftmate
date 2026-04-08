import type {
  LLMProvider,
  ChatMessage,
  ToolDefinition,
  ToolCall,
} from "../types";

export class OllamaProvider implements LLMProvider {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";
    this.model = process.env.OLLAMA_MODEL ?? "qwen2.5:7b";
  }

  async chat(
    messages: ChatMessage[],
    tools: ToolDefinition[],
  ): Promise<ChatMessage> {
    const body: Record<string, unknown> = {
      model: this.model,
      messages: messages.map((m) => {
        if (m.role === "tool") {
          return {
            role: "tool",
            content: m.content,
            tool_call_id: m.toolCallId,
          };
        }
        if (m.toolCalls?.length) {
          return {
            role: "assistant",
            content: m.content || null,
            tool_calls: m.toolCalls.map((tc) => ({
              id: tc.id,
              type: "function",
              function: {
                name: tc.name,
                arguments: JSON.stringify(tc.arguments),
              },
            })),
          };
        }
        return { role: m.role, content: m.content };
      }),
    };

    if (tools.length > 0) {
      body.tools = tools.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      }));
    }

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as any;
    const choice = data.choices?.[0]?.message;

    if (!choice) {
      return { role: "assistant", content: "No response from model." };
    }

    const toolCalls: ToolCall[] = (choice.tool_calls ?? []).map((tc: any) => ({
      id: tc.id ?? crypto.randomUUID(),
      name: tc.function.name,
      arguments:
        typeof tc.function.arguments === "string"
          ? JSON.parse(tc.function.arguments)
          : tc.function.arguments,
    }));

    return {
      role: "assistant",
      content: choice.content ?? "",
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }
}
