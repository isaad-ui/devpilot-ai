import { Router } from "express";
import rateLimit from "express-rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { MODES } from "./prompts.js";
import { generateAssistantResponse, streamAssistantResponse } from "./ai.js";

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

// Returns { error } or { params }.
function validate(body) {
  const { mode, code, language = "plaintext", question = "" } = body ?? {};
  if (!MODES.includes(mode)) return { error: `Unsupported mode. Use one of: ${MODES.join(", ")}.` };
  if (typeof code !== "string" || !code.trim()) return { error: "Please provide some code." };
  if (code.length > MAX_CODE_CHARS) return { error: `Code is too long (max ${MAX_CODE_CHARS} characters).` };
  if (typeof language !== "string" || !LANGUAGE_RE.test(language)) return { error: "Invalid language." };
  if (typeof question !== "string" || question.length > MAX_QUESTION_CHARS)
    return { error: `Question/error text is too long (max ${MAX_QUESTION_CHARS} characters).` };
  return { params: { mode, code, language: language.trim(), question: question.trim() } };
}

// Maps any provider/internal error to a safe { status, error } pair.
// Logs only the error type/status, never request content or keys.
function toPublicError(err) {
  console.error("Assistant error:", err?.name, err?.status);
  if (err instanceof Anthropic.RateLimitError) return { status: 429, error: "The AI provider is busy. Please try again shortly." };
  if (err instanceof Anthropic.APIConnectionTimeoutError) return { status: 504, error: "The AI provider took too long to respond." };
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError)
    return { status: 502, error: "The AI service is misconfigured. Please contact the site owner." };
  if ([422, 502, 503].includes(err?.status) && !(err instanceof Anthropic.APIError)) return { status: err.status, error: err.message };
  return { status: 500, error: "Something went wrong while generating a response." };
}

assistantRouter.post("/", async (req, res) => {
  const v = validate(req.body);
  if (v.error) return fail(res, 400, v.error);
  try {
    res.json({ answer: await generateAssistantResponse(v.params) });
  } catch (err) {
    const { status, error } = toPublicError(err);
    fail(res, status, error);
  }
});

// Server-Sent Events: data {"t": "<text delta>"} per chunk, then "event: done" or "event: error".
assistantRouter.post("/stream", async (req, res) => {
  const v = validate(req.body);
  if (v.error) return fail(res, 400, v.error);

  const controller = new AbortController();
  res.on("close", () => controller.abort()); // client left: stop generating

  let started = false;
  const send = (event, data) => res.write(`${event ? `event: ${event}\n` : ""}data: ${JSON.stringify(data)}\n\n`);
  const start = () => {
    if (started) return;
    started = true;
    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
  };

  try {
    await streamAssistantResponse(v.params, (t) => { start(); send(null, { t }); }, controller.signal);
    start();
    send("done", {});
    res.end();
  } catch (err) {
    if (controller.signal.aborted) return res.end();
    const { status, error } = toPublicError(err);
    if (!started) return fail(res, status, error); // nothing sent yet: normal JSON error
    send("error", { error });
    res.end();
  }
});
