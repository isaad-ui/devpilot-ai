# DevPilot AI

A web app that helps developers understand, debug, and review code with an AI model. Paste code, pick a tool, get a structured answer you can copy.

> Status: work in progress. AI answers are suggestions and can be wrong. Always verify them.

## Features (implemented)

- **Explain Code**: beginner-friendly, step-by-step explanation.
- **Debug Code**: likely cause, why it happens, suggested fix, how to verify.
- **Review Code**: findings grouped by severity.
- Copy result, example prompts, loading / error / empty states, responsive layout.
- Server-side validation, input limits, rate limiting, and safe error messages.

Not included by design: running user code, accounts, GitHub integration.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express (ES modules)
- AI: Anthropic API, called only from the server via `@anthropic-ai/sdk`

## Architecture

```
Browser (React)  --POST /api/assistant-->  Express  --->  Anthropic API
     ^                                        |
     +------------ { answer } ----------------+
```

The API key lives only in the server environment and is never sent to the browser.

## Local setup

Requires Node.js 20+.

```bash
# 1. Backend
cd server
cp .env.example .env     # then set AI_API_KEY
npm install
npm run dev              # http://localhost:5000/api/health

# 2. Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

### Environment variables

| File | Variable | Purpose |
|---|---|---|
| `server/.env` | `AI_API_KEY` | Anthropic API key (never commit) |
| `server/.env` | `AI_MODEL` | Model id (default `claude-sonnet-5-5`) |
| `server/.env` | `CLIENT_ORIGIN` | Allowed frontend origin for CORS |
| `server/.env` | `PORT` | Server port (default 5000) |
| `client/.env` | `VITE_API_URL` | Backend URL |

### Tests

```bash
cd server && npm test
```

Covers health, input validation, malformed JSON, and the no-key error path. They do not call the AI provider.

## Privacy

Code you submit is sent to the AI provider to generate a response. Do not paste passwords, tokens, private keys, personal data, or confidential code. The server does not log submitted code.

## Known limitations

- Answers are not verified and may be incorrect or incomplete.
- Input limit: 20,000 characters of code, 5,000 of question text.
- Rate limit: 10 requests per minute per IP.
- The Monaco editor is loaded from a CDN at runtime.
- Not deployed yet; see Deployment below.

## License

See [LICENSE](LICENSE).

## Deployment

1. **API** (any Node host). `render.yaml` is a ready Render Blueprint (root dir `server`, start `npm start`, health check `/api/health`). Set these in the host's secret settings, not in git: `AI_API_KEY`, `CLIENT_ORIGIN` (the exact deployed frontend origin, no trailing slash), and `TRUST_PROXY=1` when behind a proxy.
2. **Frontend** (any static host). Root dir `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the deployed API URL **before** building (Vite inlines it at build time).
3. Smoke test in a private window: one request per mode, an empty-input check, and confirm no key appears in page source or network responses.

The editor loads Monaco from the jsDelivr CDN at runtime, so the browser needs internet access to it.
