import './ExpandOverlay.css';

export default function ExpandOverlay({
  quote,
  onClose,
}: {
  quote: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className={`expand-overlay ${quote ? 'show' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="语录详情"
    >
      <div className="expand-card" onClick={e => e.stopPropagation()}>
        <div className="quote-text">{quote}</div>
        <div className="shuanq-big">栓Q</div>
      </div>
    </div>
  );
}
