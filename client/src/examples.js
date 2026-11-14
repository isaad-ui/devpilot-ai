// One realistic snippet per language. Each contains a genuine problem so the same
// snippet works for all three tools: `error` is the real message it produces (Debug).
const SAMPLES = {
  python: {
    code: ["def average(nums):", "    return sum(nums) / len(nums)", "", "print(average([]))"],
    error: "ZeroDivisionError: division by zero",
  },
  javascript: {
    code: [
      "function getInitials(user) {",
      "  return user.profile.name",
      "    .split(' ')",
      "    .map((part) => part[0])",
      "    .join('');",
      "}",
      "",
      "console.log(getInitials({}));",
    ],
    error: "TypeError: Cannot read properties of undefined (reading 'name')",
  },
  typescript: {
    code: [
      "function double(x: number): number {",
      "  return x * 2;",
      "}",
      "",
      'const result = double("21");',
      "console.log(result);",
    ],
    error: 'error TS2345: Argument of type \'string\' is not assignable to parameter of type \'number\'.',
  },
  java: {
    code: [
      "public class Main {",
      "    public static void main(String[] args) {",
      "        int[] scores = new int[3];",
      "        for (int i = 0; i <= scores.length; i++) {",
      "            scores[i] = i * 10;",
      "        }",
      "    }",
      "}",
    ],
    error: "Exception in thread \"main\" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3",
  },
  c: {
    code: [
      "#include <stdio.h>",
      "#include <string.h>",
      "",
      "int main(void) {",
      "    char name[4];",
      '    strcpy(name, "Alexander");',
      '    printf("%s\\n", name);',
      "    return 0;",
      "}",
    ],
    error: "*** stack smashing detected ***: terminated",
  },
  "c++": {
    code: [
      "#include <iostream>",
      "#include <vector>",
      "",
      "int main() {",
      "    std::vector<int> v{1, 2, 3};",
      "    std::cout << v.at(3) << std::endl;",
      "    return 0;",
      "}",
    ],
    error: "terminate called after throwing an instance of 'std::out_of_range'\n  what():  vector::_M_range_check: __n (which is 3) >= this->size() (which is 3)",
  },
  "c#": {
    code: [
      "using System;",
      "",
      "class Program {",
      "    static void Main() {",
      "        string name = null;",
      "        Console.WriteLine(name.Length);",
      "    }",
      "}",
    ],
    error: "System.NullReferenceException: Object reference not set to an instance of an object.",
  },
  go: {
    code: [
      "package main",
      "",
      'import "fmt"',
      "",
      "func main() {",
      "    var counts map[string]int",
      '    counts["apples"] = 3',
      "    fmt.Println(counts)",
      "}",
    ],
    error: "panic: assignment to entry in nil map",
  },
  rust: {
    code: [
      "fn main() {",
      "    let mut items = vec![1, 2, 3];",
      "    let first = &items[0];",
      "    items.push(4);",
      '    println!("{}", first);',
      "}",
    ],
    error: "error[E0502]: cannot borrow `items` as mutable because it is also borrowed as immutable",
  },
  php: {
    code: [
      "<?php",
      "function getCity($user) {",
      "    return strtoupper($user->address->city);",
      "}",
      "",
      "$user = new stdClass();",
      "echo getCity($user);",
    ],
    error: 'Warning: Attempt to read property "city" on null',
  },
  ruby: {
    code: [
      "def greeting(name)",
      '  "Hello, #{name.capitalize}!"',
      "end",
      "",
      "puts greeting(nil)",
    ],
    error: "undefined method `capitalize' for nil:NilClass (NoMethodError)",
  },
  sql: {
    code: [
      "SELECT department, name, COUNT(*) AS headcount",
      "FROM employees",
      "GROUP BY department;",
    ],
    error: 'ERROR: column "employees.name" must appear in the GROUP BY clause or be used in an aggregate function',
  },
  bash: {
    code: [
      "#!/bin/bash",
      "",
      "if [ $count -gt 5 ]; then",
      '  echo "Too many files"',
      "fi",
    ],
    error: "./check.sh: line 3: [: -gt: unary operator expected",
  },
  html: {
    code: [
      '<div class="card">',
      "  <h2>Welcome</h2>",
      '  <img src="logo.png">',
      "  <p>Sign up for our newsletter",
      "</div>",
      '<button onclick="subscribe()">Subscribe</button>',
    ],
    error: "The button appears inside the card styling, and the image has no alt text.",
  },
  css: {
    code: [
      ".card {",
      "  display: flex;",
      "  justify-content: center;",
      "}",
      "",
      ".card p {",
      "  widht: 50%;",
      "  colour: #333;",
      "}",
    ],
    error: "The paragraph width and text colour are not being applied.",
  },
};

const GENERIC_QUESTION = {
  explain: "Walk me through what this code does.",
  review: "Focus on bugs, security and readability.",
};

// Returns an example for the currently selected language and tool.
export function getExample(mode, language) {
  const sample = SAMPLES[language] ?? SAMPLES.python;
  return {
    code: sample.code.join("\n"),
    question: mode === "debug" ? sample.error : GENERIC_QUESTION[mode],
  };
}

export const MODE_INFO = {
  explain: { label: "Explain", blurb: "Understand what code does", tip: "Get a plain-language walkthrough of the code", outputs: ["Summary of the purpose", "Step-by-step explanation", "Key variables and functions", "Ways to check your understanding"], action: "Explain this code", questionLabel: "Question (optional)", questionHint: "Anything specific you want explained?" },
  debug: { label: "Debug", blurb: "Find and fix an error", tip: "Paste the code and the exact error to find the cause", outputs: ["Likely cause", "Why it happens", "Corrected code", "How to verify the fix"], action: "Find the problem", questionLabel: "Error message / what happened", questionHint: "Paste the exact error or traceback, and what you expected." },
  review: { label: "Review", blurb: "Spot risks and improvements", tip: "Check for bugs, security issues and code quality", outputs: ["Bugs and correctness risks", "Security vulnerabilities", "Code quality issues", "Recommended improvements"], action: "Review this code", questionLabel: "Review focus (optional)", questionHint: "e.g. security, readability, performance" },
};

export const LANGUAGES = ["python", "javascript", "typescript", "java", "c", "c++", "c#", "go", "rust", "php", "ruby", "sql", "bash", "html", "css"];
