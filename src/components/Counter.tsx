import { useState, useEffect } from 'react';
import './Counter.css';

const MOODS = ['微栓', '小栓', '中栓', '大栓', '超级栓', '栓麻了'];

export default function Counter({ count }: { count: number }) {
  const [display, setDisplay] = useState(count);
  const [glitching, setGlitching] = useState(false);
  const [moodIdx, setMoodIdx] = useState(3);

  useEffect(() => {
    setDisplay(count);
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      const inc = Math.floor(Math.random() * 5) + 1;
      setDisplay(prev => prev + inc);
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
      if (Math.random() > 0.7) {
        setMoodIdx(Math.floor(Math.random() * MOODS.length));
      }
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="wordmark">SHUANQ.TOP</div>
      <div className="counter-wrap">
        <span className="counter-label">已有</span>
        <span className={`counter-number ${glitching ? 'glitch' : ''}`}>
          {display.toLocaleString()}
        </span>
        <span className="counter-unit">人栓Q</span>
      </div>
      <div className="mood-bar">
        <span>今日栓Q指数</span>
        <span className="mood-level">{MOODS[moodIdx]}</span>
      </div>
    </header>
  );
}
