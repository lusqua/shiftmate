import type { Context } from "hono";
import { createProvider, type ChatMessage } from "@shiftmate/llm";
import type { AuthContext } from "@shiftmate/auth";
import { toolDefinitions } from "../../tools/definitions";
import { executeTool } from "../../tools/executor";

const SYSTEM_PROMPT = `You are ShiftMate, an AI assistant for restaurant staff scheduling. You help the manager create, modify, and view work schedules.

You have access to tools to manage the schedule. Always use the appropriate tool to execute actions — don't just describe what should be done. Use tools to fetch data when you need it (e.g. list_workers, get_schedule, get_schedule_rules).

When referring to dates, use YYYY-MM-DD format. Today is {{DAY_OF_WEEK}}, {{DATE}}. The current week starts on Monday {{WEEK_START}}.

## Guidelines
- Be concise and helpful
- After making changes, confirm what was done
- If a request is ambiguous, ask for clarification
- When auto-filling, report any unfilled shifts
- Dates should always reference the Monday of the week (week_start parameter)
- Respond in the same language the user writes in`;

export const chatPost = async (c: Context) => {
  const auth = c.get("auth") as AuthContext;
  const { messages: userMessages } = (await c.req.json()) as {
    messages: ChatMessage[];
  };

  const provider = createProvider();
  const now = new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayOfWeek = now.getDay();
  const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayDiff);

  const systemPrompt = SYSTEM_PROMPT.replace(
    "{{DAY_OF_WEEK}}",
    dayNames[dayOfWeek]!,
  )
    .replace("{{DATE}}", now.toLocaleDateString("sv-SE"))
    .replace("{{WEEK_START}}", monday.toLocaleDateString("sv-SE"));

  const fullMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...userMessages,
  ];

  const processChat = async (iteration: number): Promise<Response> => {
    console.log(
      `\n--- Chat iteration ${iteration} (tenant:${auth.tenantId}) ---`,
    );

    if (iteration >= 5) {
      console.log("Max iterations reached, stopping.");
      return c.json({
        message: {
          role: "assistant",
          content:
            "I completed multiple operations. Please check the schedule.",
        },
      });
    }

    try {
      console.log(`Sending ${fullMessages.length} messages to LLM...`);
      const response = await provider.chat(fullMessages, toolDefinitions);

      if (!response.toolCalls?.length) {
        console.log(
          `LLM response: "${response.content.slice(0, 200)}${response.content.length > 200 ? "..." : ""}"`,
        );
        return c.json({ message: response });
      }

      console.log(`LLM requested ${response.toolCalls.length} tool call(s):`);
      fullMessages.push(response);

      for (const call of response.toolCalls) {
        console.log(`  -> ${call.name}(${JSON.stringify(call.arguments)})`);
        const result = await executeTool(
          call.name,
          call.arguments,
          auth.tenantId,
        );
        console.log(
          `  <- ${call.name} result: ${JSON.stringify(result).slice(0, 300)}${JSON.stringify(result).length > 300 ? "..." : ""}`,
        );
        fullMessages.push({
          role: "tool",
          content: JSON.stringify(result),
          toolCallId: call.id,
        });
      }

      return processChat(iteration + 1);
    } catch (err: any) {
      console.error(`LLM error: ${err.message}`);
      return c.json({
        message: {
          role: "assistant",
          content: `Error communicating with AI: ${err.message}`,
        },
      });
    }
  };

  return processChat(0);
};
