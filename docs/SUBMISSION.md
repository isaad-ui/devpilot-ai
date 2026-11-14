# Submission drafts

Drafts for the Devpost entry and demo video. Items in **[BRACKETS]** need you: fill them in or delete them. Only keep claims that are true when you submit.

## Devpost story (draft)

### Inspiration
Reading unfamiliar code, decoding an error, or getting a second opinion on a change is slow, especially for beginners. I wanted one small app that does those three things well and is honest about what an AI cannot know. **[Add your own motivation here.]**

### What it does
DevPilot AI is a web app with three tools. **Explain Code** walks through a snippet in beginner-friendly language. **Debug Code** takes code plus an error and returns the likely cause, why it happens, a suggested fix, and how to verify it. **Review Code** returns findings grouped by severity. Results are rendered as formatted Markdown and can be copied. The app never runs submitted code, and every answer carries a reminder to verify it.

### How I built it
React + Vite frontend with the Monaco editor; Node.js + Express backend; Anthropic's Claude API called only from the server so the key never reaches the browser. The server validates mode, language, and input size, applies rate limiting, and maps provider failures to safe messages. Prompts are task-specific and ask for fixed headings. I built it milestone by milestone with an AI coding assistant (**[Kiro / Claude Code: state accurately which you used]**), reviewing each diff and testing after each step.

### Challenges
- Keeping the API key server-side and returning errors that never leak secrets or stack traces.
- Rendering the model's Markdown safely: my first renderer showed raw `**` and backticks; I switched to `react-markdown`, which avoids `innerHTML`.
- Installing the Monaco editor pulled in a vulnerable transitive dependency (`dompurify`); I pinned a patched version so `npm audit` reports zero issues.
- Making the server testable without an API key by separating the Express app from the listener.
- **[Add any real challenges you hit while testing and deploying.]**

### Accomplishments
- All three tools return useful, structured answers from the real model. **[Add what you verified yourself.]**
- Input limits, rate limiting, and automated validation tests (`npm test`).

### What I learned
**[Your own words: e.g. calling an AI API securely from a backend, prompt structure, handling provider errors.]**

### What's next
Streaming responses, a refusal fallback to a second model, saved history, and a sandboxed code runner (isolated, with strict resource limits, never on the Express server).

### Built with
React, Vite, Monaco Editor, react-markdown, Node.js, Express, Anthropic Claude API, **[hosting providers]**

### Links
- Live demo: **[URL]**
- Source: https://github.com/isaad-ui/devpilot-ai
- Demo video: **[URL]**

## Demo video script (60 to 90 seconds)

Record the real, deployed (or local) app. Do not hide failures.

| Time | Show | Say |
|---|---|---|
| 0:00 | Landing page | "DevPilot AI helps developers understand, debug, and review code." |
| 0:10 | Explain tab, **Load an example**, run | "Paste code, pick a tool. Here it explains a memoized Fibonacci in plain language." |
| 0:30 | Debug tab, load example, run | "With an error message, it finds the likely cause and suggests a verified fix path." |
| 0:50 | Review tab, load example, run | "Review flags a SQL injection and separates critical issues from optional ones." |
| 1:05 | Copy button, footer note | "Results copy in one click, and it reminds you AI suggestions can be wrong." |
| 1:15 | Briefly show code or README | "Built with React, Express, and the Claude API, with the key kept on the server. Next: streaming and a sandboxed runner." |

## Pre-submission checklist

- [ ] Rotate the API key (it was shared in a chat); confirm `.env` was never committed
- [ ] Deploy API and frontend; run the smoke test in a private window
- [ ] Add live URL and real screenshots to the README
- [ ] Replace every **[BRACKET]** above; delete claims that are not true
- [ ] Read the official Kiroween rules (Kiro usage, team size, deadlines, required Devpost fields)
