import type {
  LLMProvider,
  ChatMessage,
  ToolDefinition,
  ToolCall,
} from "../types";

export class ClaudeProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY ?? "";
    this.model = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-20250514";
  }

  async chat(
    messages: ChatMessage[],
    tools: ToolDefinition[],
  ): Promise<ChatMessage> {
    // Separate system message
    const systemMsg = messages.find((m) => m.role === "system");
    const nonSystemMsgs = messages.filter((m) => m.role !== "system");

    // Convert messages to Claude format
    const claudeMessages = nonSystemMsgs.map((m) => {
      if (m.role === "tool") {
        return {
          role: "user" as const,
          content: [
            {
              type: "tool_result",
              tool_use_id: m.toolCallId,
              content: m.content,
            },
          ],
        };
      }

      if (m.toolCalls?.length) {
        return {
          role: "assistant" as const,
          content: [
            ...(m.content ? [{ type: "text", text: m.content }] : []),
            ...m.toolCalls.map((tc) => ({
              type: "tool_use",
              id: tc.id,
              name: tc.name,
              input: tc.arguments,
            })),
          ],
        };
      }

      return { role: m.role as "user" | "assistant", content: m.content };
    });

    const body: Record<string, unknown> = {
      model: this.model,
      max_tokens: 4096,
      messages: claudeMessages,
    };

    if (systemMsg) {
      body.system = systemMsg.content;
    }

    if (tools.length > 0) {
      body.tools = tools.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      }));
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Claude error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as any;

    const textBlocks = (data.content ?? []).filter(
      (b: any) => b.type === "text",
    );
    const toolBlocks = (data.content ?? []).filter(
      (b: any) => b.type === "tool_use",
    );

    const content = textBlocks.map((b: any) => b.text).join("\n");

    const toolCalls: ToolCall[] = toolBlocks.map((b: any) => ({
      id: b.id,
      name: b.name,
      arguments: b.input,
    }));

    return {
      role: "assistant",
      content,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }
}
