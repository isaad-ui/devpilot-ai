# DevPilot AI

An AI-powered developer assistant. Paste code, pick a tool, and get a structured explanation, debugging help, or code review you can copy.

**Live demo:** _not deployed yet_ (see [Deployment](#deployment))

> AI answers are suggestions and can be wrong. Always verify them before using them.

## Problem and motivation

Beginners and busy developers often hit code they do not fully understand, an error they cannot place, or a change they want a second opinion on. DevPilot AI puts three focused tools in one small web app, and is explicit about what the AI cannot know (it never runs your code).

## Features

- **Explain Code**: beginner-friendly, step-by-step explanation that defines jargon.
- **Debug Code**: likely cause, why it happens, a suggested fix, and how to verify it. It asks for missing details instead of inventing a cause.
- **Review Code**: findings grouped by severity (critical vs. optional).
- Monaco code editor with syntax highlighting, line numbers, and light/dark theme.
- Answers rendered as Markdown (lists, tables, code blocks), with a Copy button.
- Example prompts for each tool; loading, empty, error, and success states; responsive layout.
- Server-side validation, input limits, rate limiting, and safe error messages.

**Deliberately not included:** running user code, accounts, GitHub integration, file editing.

## Stack

| Part | Technology |
|---|---|
| Frontend | React 19, Vite, Monaco Editor (`@monaco-editor/react`), `react-markdown` |
| Backend | Node.js, Express (ES modules), `express-rate-limit` |
| AI | Anthropic API via `@anthropic-ai/sdk`, called only from the server |

## Architecture

```
Browser (React) --POST /api/assistant--> Express --> Anthropic API
      ^                                    |
      +------------- { answer } -----------+
```

- The React app handles the user experience and sends `{ mode, language, code, question }`.
- The Express server validates input, builds a mode-specific prompt (`server/prompts.js`), calls the provider (`server/ai.js`), and returns `{ answer }` or `{ error }`.
- The API key exists only in the server environment. It is never sent to the browser.

```
server/  app.js (Express app)  index.js (listener)  routes.js  ai.js  prompts.js  server.test.js
client/  src/App.jsx  src/components/{Header,ModeSelector,CodeInput,QuestionInput,ResultPanel}.jsx
```

## Local setup

Requires Node.js 20+ and an Anthropic API key.

```bash
# Backend
cd server
cp .env.example .env     # then set AI_API_KEY
npm install
npm run dev              # http://localhost:5000/api/health

# Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

### Environment variables

| File | Variable | Purpose |
|---|---|---|
| `server/.env` | `AI_API_KEY` | Anthropic API key. **Never commit.** |
| `server/.env` | `AI_MODEL` | Model id (default `claude-sonnet-5-5`) |
| `server/.env` | `CLIENT_ORIGIN` | Allowed frontend origin for CORS |
| `server/.env` | `PORT` | Server port (default 5000) |
| `server/.env` | `TRUST_PROXY` | Set to `1` when behind a hosting proxy |
| `client/.env` | `VITE_API_URL` | Backend URL (inlined at build time) |

## Testing

Automated (no AI calls, no key needed):

```bash
cd server && npm test
```

Covers the health endpoint, rejection of a bad mode, empty code, oversized code, malformed JSON, and the safe error when no key is configured.

Manual checklist (run before a release):

| Test | Expected |
|---|---|
| Explain / Debug / Review with the built-in examples | Relevant, sectioned answer; Copy works |
| Submit empty code | Validation message, no request sent |
| Code over 20,000 characters | Editor caps input; server rejects if bypassed |
| Invalid API key | Friendly error, no secret or stack trace |
| Server stopped | "Could not reach the server" and input is kept |
| 11 requests in a minute | Rate-limit message |
| Phone width and dark mode | Layout stacks; theme follows OS |

## Deployment

1. **API** (any Node host). `render.yaml` is a ready Render Blueprint (root `server`, start `npm start`, health check `/api/health`). Set in the host's secret settings, never in git: `AI_API_KEY`, `CLIENT_ORIGIN` (the exact frontend origin, no trailing slash), and `TRUST_PROXY=1`.
2. **Frontend** (any static host). Root `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the deployed API URL **before** building.
3. Smoke test in a private window: one request per mode, an empty-input check, and confirm no key is visible in page source or network responses.

## Privacy and safety

- Code you submit is sent to the AI provider to generate a response. Do not paste passwords, tokens, private keys, personal data, or confidential code.
- The server does not log submitted code, only error type and status.
- User code is never executed. The model is instructed not to claim it ran anything.

## Known limitations

- Answers are not verified and may be incorrect or incomplete.
- Limits: 20,000 characters of code, 5,000 of question text; 10 requests per minute per IP.
- The Monaco editor loads from a CDN at runtime, so it needs internet access.
- Responses are not streamed; a long answer can take several seconds.
- A request the provider declines (refusal) returns a plain error; no automatic model fallback.
- Not deployed yet.

## Credits and AI disclosure

Answers are generated by Anthropic's Claude models. The code in this repository was developed with AI assistance (Claude Code) and reviewed by the author.

## License

See [LICENSE](LICENSE).
