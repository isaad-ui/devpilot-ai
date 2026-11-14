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
- Plain textarea input (no syntax-highlighting editor yet).
- Not yet deployed.

## License

See [LICENSE](LICENSE).
