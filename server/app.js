import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { assistantRouter } from "./routes.js";

dotenv.config();

const app = express();

// Behind a hosting proxy (Render, etc.) so rate limiting sees the real client IP.
if (process.env.TRUST_PROXY) app.set("trust proxy", Number(process.env.TRUST_PROXY));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "DevPilot API" });
});

app.use("/api/assistant", assistantRouter);

// Malformed JSON / oversized body -> clean 4xx, no stack trace
app.use((err, _req, res, _next) => {
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  res.status(status).json({ error: status === 413 ? "Request body too large." : status === 500 ? "Server error." : "Invalid request." });
});

export default app;
