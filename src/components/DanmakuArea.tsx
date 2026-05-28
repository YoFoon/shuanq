import { useMemo } from 'react';
import { PRESET_QUOTES } from '../lib/quotes';
import './DanmakuArea.css';

const NUM_ROWS = 9;

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getItemClass(rowIndex: number, i: number) {
  const classes = ['danmaku-item'];
  const sizeRand = (rowIndex * 7 + i) % 10;
  if (sizeRand < 2) classes.push('size-lg');
  else if (sizeRand > 7) classes.push('size-sm');

  const colorRand = (rowIndex * 3 + i) % 12;
  if (colorRand === 0) classes.push('highlight');
  else if (colorRand === 3) classes.push('green');
  else if (colorRand === 7) classes.push('pink');

  if ((rowIndex + i) % 9 === 0) classes.push('glow');

  return classes.join(' ');
}

function DanmakuRow({ quotes, rowIndex }: { quotes: string[]; rowIndex: number }) {
  const isReverse = rowIndex % 2 === 1;
  const duration = 35 + rowIndex * 4;
  const doubled = [...quotes, ...quotes];

  return (
    <div
      className={`danmaku-row ${isReverse ? 'reverse' : ''}`}
      style={{ top: `${rowIndex * 52}px`, animationDuration: `${duration}s` }}
    >
      {doubled.map((q, i) => (
        <div key={`${rowIndex}-${i}`} className={getItemClass(rowIndex, i)} data-quote={q}>
          <span>{q}</span>
          <span className="shuanq-tag">栓Q</span>
        </div>
      ))}
    </div>
  );
}

export default function DanmakuArea({
  quotes,
  onQuoteClick,
}: {
  quotes: string[];
  onQuoteClick: (q: string) => void;
}) {
  const rows = useMemo(() => {
    const all = quotes.length > 0 ? quotes : PRESET_QUOTES;
    const shuffled = shuffle(all);
    const perRow = Math.ceil(shuffled.length / NUM_ROWS);
    const result: string[][] = [];
    for (let i = 0; i < NUM_ROWS; i++) {
      const start = (i * 7) % shuffled.length;
      const rowQuotes: string[] = [];
      for (let j = 0; j < perRow; j++) {
        rowQuotes.push(shuffled[(start + j) % shuffled.length]);
      }
      result.push(rowQuotes);
    }
    return result;
  }, [quotes]);

  const handleClick = (e: React.MouseEvent) => {
    const item = (e.target as HTMLElement).closest('.danmaku-item') as HTMLElement | null;
    if (item?.dataset.quote) {
      onQuoteClick(item.dataset.quote);
    }
  };

  return (
    <div className="danmaku-area" onClick={handleClick}>
      <div className="danmaku-fade-top" />
      <div className="danmaku-fade-bottom" />
      {rows.map((rowQuotes, i) => (
        <DanmakuRow key={i} quotes={rowQuotes} rowIndex={i} />
      ))}
    </div>
  );
}
