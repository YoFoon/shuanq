import { useState } from 'react';
import './InputBar.css';

export default function InputBar({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    const content = value.trim();
    if (!content || submitting) return;
    setSubmitting(true);
    onSubmit(content);
    setValue('');
    setTimeout(() => setSubmitting(false), 1500);
  };

  return (
    <div className="input-bar">
      <input
        className="input-field"
        placeholder="说说你的栓Q瞬间..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        maxLength={80}
        aria-label="输入你的栓Q瞬间"
      />
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!value.trim() || submitting}
        aria-label="提交"
      >
        栓
      </button>
    </div>
  );
}
