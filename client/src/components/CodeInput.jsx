import { LANGUAGES } from "../examples.js";

export default function CodeInput({ language, code, onLanguageChange, onCodeChange }) {
  return (
    <>
      <label className="field">
        <span>Language</span>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Code</span>
        <textarea className="code" value={code} onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false} placeholder="Paste your code here" maxLength={20000} />
      </label>
    </>
  );
}
