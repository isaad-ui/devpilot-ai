import { MODE_INFO } from "../examples.js";

export default function QuestionInput({ mode, value, onChange }) {
  const info = MODE_INFO[mode];
  return (
    <label className="field">
      <span>{info.questionLabel}</span>
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={info.questionHint} maxLength={5000} />
    </label>
  );
}
