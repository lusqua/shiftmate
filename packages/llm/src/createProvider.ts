import type { LLMProvider } from "./types";
import { OllamaProvider } from "./providers/ollama";
import { ClaudeProvider } from "./providers/claude";

export const createProvider = (): LLMProvider => {
  const provider = process.env.LLM_PROVIDER ?? "ollama";

  if (provider === "claude") {
    return new ClaudeProvider();
  }

  return new OllamaProvider();
};
