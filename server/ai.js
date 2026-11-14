import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "./prompts.js";

const MODEL = process.env.AI_MODEL || "claude-sonnet-5-5";
let client;

// Lazily created so the server (and /api/health) still starts without a key.
function getClient() {
  if (!process.env.AI_API_KEY) {
    const err = new Error("AI provider is not configured.");
    err.status = 503;
    throw err;
  }
  client ??= new Anthropic({ apiKey: process.env.AI_API_KEY, timeout: 60_000, maxRetries: 1 });
  return client;
}

export async function generateAssistantResponse({ mode, code, language, question }) {
  const { system, user } = buildPrompt({ mode, code, language, question });
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 8000,
    system,
    messages: [{ role: "user", content: user }],
  });

  if (response.stop_reason === "refusal") {
    const err = new Error("The AI provider declined this request.");
    err.status = 422;
    throw err;
  }
  const text = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  if (!text) {
    const err = new Error("The AI provider returned an empty response.");
    err.status = 502;
    throw err;
  }
  return text;
}
