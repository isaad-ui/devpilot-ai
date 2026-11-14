import { MODE_INFO } from "../examples.js";

const ICONS = {
  explain: <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM8 7h7M8 11h5" />,
  debug: (
    <>
      <path d="M8 2l1.9 1.9M16 2l-1.9 1.9" />
      <path d="M9 7.1V6a3 3 0 0 1 6 0v1.1" />
      <path d="M12 20a6 6 0 0 1-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3a6 6 0 0 1-6 6zM12 20v-9M6 13H2M22 13h-4M6 17l-3 2M18 17l3 2" />
    </>
  ),
  review: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export default function ModeSelector({ mode, onChange }) {
  return (
    <div>
      <span className="label">What do you need?</span>
      <div className="modes" role="group" aria-label="Choose a tool">
        {Object.entries(MODE_INFO).map(([key, { label, blurb }]) => (
          <button key={key} type="button" className="mode" aria-pressed={mode === key} onClick={() => onChange(key)}>
            <span className="mode-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[key]}
              </svg>
            </span>
            <span className="mode-title">{label}</span>
            <span className="mode-desc">{blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
