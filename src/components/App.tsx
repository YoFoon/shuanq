import { useState, useEffect, useCallback } from 'react';
import Counter from './Counter';
import DanmakuArea from './DanmakuArea';
import InputBar from './InputBar';
import Confetti from './Confetti';
import ExpandOverlay from './ExpandOverlay';
import './App.css';

export default function App() {
  const [count, setCount] = useState(12847);
  const [quotes, setQuotes] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/count')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {});

    fetch('/api/quotes')
      .then(r => r.json())
      .then(d => setQuotes(d.quotes))
      .catch(() => {});
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }, []);

  const handleSubmit = useCallback(async (content: string) => {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.error || '提交失败');
      return;
    }

    setShaking(true);
    setConfettiActive(true);
    setCount(prev => prev + 1);
    showToast('栓Q成功！已加入吐槽墙');
    setQuotes(prev => [content, ...prev]);

    setTimeout(() => setShaking(false), 400);
    setTimeout(() => setConfettiActive(false), 2000);
  }, [showToast]);

  return (
    <div className={`app-root ${shaking ? 'shake' : ''}`}>
      <Counter count={count} />
      <DanmakuArea quotes={quotes} onQuoteClick={setExpandedQuote} />
      <InputBar onSubmit={handleSubmit} />
      <div className={`toast ${toastVisible ? 'show' : ''}`}>{toastMsg}</div>
      <Confetti active={confettiActive} />
      <ExpandOverlay quote={expandedQuote} onClose={() => setExpandedQuote(null)} />
      <div className="watermark">shuanq.top</div>
    </div>
  );
}
