import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { LANGUAGES } from "../examples.js";

const MAX_CODE = 20000;

// Map our language names to Monaco language ids.
const MONACO_LANG = { "c++": "cpp", "c#": "csharp", bash: "shell" };

// Editor themes tuned to the app palette (ink, white, one blue accent).
function defineThemes(monaco) {
  monaco.editor.defineTheme("devpilot-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "ECECEA" },
      { token: "comment", foreground: "6E7681", fontStyle: "italic" },
      { token: "keyword", foreground: "6B95FF" },
      { token: "string", foreground: "8FD3A4" },
      { token: "number", foreground: "F0A860" },
      { token: "type", foreground: "D7DAE0" },
      { token: "delimiter", foreground: "9AA0AC" },
      { token: "operator", foreground: "9AA0AC" },
    ],
    colors: {
      "editor.background": "#0A0A0A",
      "editor.foreground": "#ECECEA",
      "editorLineNumber.foreground": "#5C5C58",
      "editorLineNumber.activeForeground": "#ECECEA",
      "editorCursor.foreground": "#4D7CFF",
      "editor.selectionBackground": "#4D7CFF55",
      "editor.inactiveSelectionBackground": "#4D7CFF28",
      "editorIndentGuide.background1": "#1F1F1D",
      "editorIndentGuide.activeBackground1": "#3A3A37",
      "scrollbarSlider.background": "#FFFFFF18",
      "scrollbarSlider.hoverBackground": "#FFFFFF2A",
    },
  });
  monaco.editor.defineTheme("devpilot-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "", foreground: "0A0A0A" },
      { token: "comment", foreground: "6B7280", fontStyle: "italic" },
      { token: "keyword", foreground: "0047FF" },
      { token: "string", foreground: "0B7A3B" },
      { token: "number", foreground: "B45309" },
    ],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#0A0A0A",
      "editorLineNumber.foreground": "#A3A3A0",
      "editorLineNumber.activeForeground": "#0A0A0A",
      "editorCursor.foreground": "#0047FF",
      "editor.selectionBackground": "#0047FF30",
      "editorIndentGuide.background1": "#EDEDEB",
    },
  });
}

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
          <div className="field-tools">
            <button type="button" className="example-btn" onClick={onExample} title="Fill the editor with a sample for the selected tool">Insert example</button>
            <button type="button" className="example-btn muted" onClick={() => onCodeChange("")} disabled={!code} title="Remove all code from the editor">Clear</button>
          </div>
        </div>
        <div className="editor" aria-labelledby="code-label">
          <Editor
            height="260px"
            language={MONACO_LANG[language] ?? language}
            beforeMount={defineThemes}
            theme={dark ? "devpilot-dark" : "devpilot-light"}
            value={code}
            onChange={(v) => onCodeChange((v ?? "").slice(0, MAX_CODE))}
            loading={<div className="state">Loading editor…</div>}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "JetBrains Mono, Consolas, monospace",
              lineNumbers: "on",
              renderLineHighlight: "none",
              bracketPairColorization: { enabled: true },
              formatOnPaste: true,
              padding: { top: 10, bottom: 10 },
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
