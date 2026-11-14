import { test, before, after } from "node:test";
import assert from "node:assert/strict";

// No key on purpose: validation must reject bad input before any AI call.
process.env.AI_API_KEY = "";
process.env.PORT = "0";

let server, base;

before(async () => {
  const { default: app } = await import("./app.js");
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const post = (body, raw = false) =>
  fetch(`${base}/api/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? body : JSON.stringify(body),
  });

test("health endpoint", async () => {
  const res = await fetch(`${base}/api/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok", service: "DevPilot API" });
});

test("rejects unsupported mode", async () => {
  assert.equal((await post({ mode: "hack", code: "x" })).status, 400);
});

test("rejects empty code", async () => {
  assert.equal((await post({ mode: "explain", code: "   " })).status, 400);
});

test("rejects oversized code", async () => {
  const res = await post({ mode: "explain", code: "a".repeat(20001) });
  assert.equal(res.status, 400);
});

test("rejects malformed JSON without a stack trace", async () => {
  const res = await post("{bad", true);
  assert.equal(res.status, 400);
  assert.ok(!JSON.stringify(await res.json()).includes("at "));
});

test("valid request without a key gives a safe 503", async () => {
  const res = await post({ mode: "debug", code: "print(1)", language: "python" });
  assert.equal(res.status, 503);
  assert.ok(!JSON.stringify(await res.json()).toLowerCase().includes("key="));
});
