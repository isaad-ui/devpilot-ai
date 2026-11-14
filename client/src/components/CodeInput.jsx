import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { LANGUAGES } from "../examples.js";

const MAX_CODE = 20000;

// Map our language names to Monaco language ids.
const MONACO_LANG = { "c++": "cpp", "c#": "csharp", bash: "shell" };

function usePrefersDark() {
  const query = "(prefers-color-scheme: dark)";
  const [dark, setDark] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return dark;
}

export default function CodeInput({ language, code, onLanguageChange, onCodeChange, onExample }) {
  const dark = usePrefersDark();

  return (
    <>
      <label className="field">
        <span>Language</span>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>
      <div className="field">
        <div className="field-head">
          <span id="code-label">Code</span>
          <button type="button" className="example-btn" onClick={onExample}>Insert example</button>
        </div>
        <div className="editor" aria-labelledby="code-label">
          <Editor
            height="260px"
            language={MONACO_LANG[language] ?? language}
            theme={dark ? "vs-dark" : "light"}
            value={code}
            onChange={(v) => onCodeChange((v ?? "").slice(0, MAX_CODE))}
            loading={<div className="state">Loading editor…</div>}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Consolas, monospace",
              renderLineHighlight: "none",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              tabSize: 2,
              ariaLabel: "Code",
            }}
          />
        </div>
        <p className="hint">{code.length.toLocaleString()} / {MAX_CODE.toLocaleString()} characters</p>
      </div>
    </>
  );
}
