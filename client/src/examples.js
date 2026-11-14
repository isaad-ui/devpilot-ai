export const EXAMPLES = {
  explain: {
    language: "python",
    code: "def fib(n, memo={}):\n    if n < 2:\n        return n\n    if n not in memo:\n        memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]",
    question: "Why is the memo dictionary in the function signature?",
  },
  debug: {
    language: "python",
    code: "def average(nums):\n    return sum(nums) / len(nums)\n\nprint(average([]))",
    question: "ZeroDivisionError: division by zero",
  },
  review: {
    language: "javascript",
    code: 'function getUser(id) {\n  const rows = db.query("SELECT * FROM users WHERE id = " + id);\n  if (rows.length > 0) { return rows[0]; } else { return null; }\n}',
    question: "Focus on security.",
  },
};

export const MODE_INFO = {
  explain: { label: "Explain", blurb: "Understand what code does", tip: "Get a plain-language walkthrough of the code", outputs: ["Summary of the purpose", "Step-by-step explanation", "Key variables and functions", "Ways to check your understanding"], action: "Explain this code", questionLabel: "Question (optional)", questionHint: "Anything specific you want explained?" },
  debug: { label: "Debug", blurb: "Find and fix an error", tip: "Paste the code and the exact error to find the cause", outputs: ["Likely cause", "Why it happens", "Corrected code", "How to verify the fix"], action: "Find the problem", questionLabel: "Error message / what happened", questionHint: "Paste the exact error or traceback, and what you expected." },
  review: { label: "Review", blurb: "Spot risks and improvements", tip: "Check for bugs, security issues and code quality", outputs: ["Bugs and correctness risks", "Security vulnerabilities", "Code quality issues", "Recommended improvements"], action: "Review this code", questionLabel: "Review focus (optional)", questionHint: "e.g. security, readability, performance" },
};

export const LANGUAGES = ["python", "javascript", "typescript", "java", "c", "c++", "c#", "go", "rust", "php", "ruby", "sql", "bash", "html", "css"];
