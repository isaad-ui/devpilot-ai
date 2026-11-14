import { Router } from "express";
import rateLimit from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { MODES } from "./prompts.js";
import { generateAssistantResponse } from "./ai.js";

const MAX_CODE_CHARS = 20_000;
const MAX_QUESTION_CHARS = 5_000;
const LANGUAGE_RE = /^[a-zA-Z0-9+#.\- ]{1,30}$/;

export const assistantRouter = Router();

assistantRouter.use(
  rateLimit({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please wait a minute and try again." },
  })
);

function fail(res, status, error) {
  return res.status(status).json({ error });
}

assistantRouter.post("/", async (req, res) => {
  const { mode, code, language = "plaintext", question = "" } = req.body ?? {};

  if (!MODES.includes(mode)) return fail(res, 400, `Unsupported mode. Use one of: ${MODES.join(", ")}.`);
  if (typeof code !== "string" || !code.trim()) return fail(res, 400, "Please provide some code.");
  if (code.length > MAX_CODE_CHARS) return fail(res, 400, `Code is too long (max ${MAX_CODE_CHARS} characters).`);
  if (typeof language !== "string" || !LANGUAGE_RE.test(language)) return fail(res, 400, "Invalid language.");
  if (typeof question !== "string" || question.length > MAX_QUESTION_CHARS)
    return fail(res, 400, `Question/error text is too long (max ${MAX_QUESTION_CHARS} characters).`);

  try {
    const answer = await generateAssistantResponse({
      mode,
      code,
      language: language.trim(),
      question: question.trim(),
    });
    res.json({ answer });
  } catch (err) {
    // Log only the error type/status, never request content or keys.
    console.error("Assistant error:", err?.name, err?.status);
    if (err instanceof Anthropic.RateLimitError) return fail(res, 429, "The AI provider is busy. Please try again shortly.");
    if (err instanceof Anthropic.APIConnectionTimeoutError) return fail(res, 504, "The AI provider took too long to respond.");
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError)
      return fail(res, 502, "The AI service is misconfigured. Please contact the site owner.");
    if ([422, 502, 503].includes(err?.status) && !(err instanceof Anthropic.APIError)) return fail(res, err.status, err.message);
    return fail(res, 500, "Something went wrong while generating a response.");
  }
});
