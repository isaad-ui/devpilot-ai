import { MODE_INFO } from "../examples.js";

export default function ModeSelector({ mode, onChange }) {
  return (
    <div>
      <span className="label">Tool</span>
      <div className="modes" role="group" aria-label="Choose a tool">
        {Object.entries(MODE_INFO).map(([key, { label, blurb }]) => (
          <button key={key} type="button" className="mode" aria-pressed={mode === key} onClick={() => onChange(key)}>
            <span className="mode-title">{label}</span>
            <span className="mode-desc">{blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
