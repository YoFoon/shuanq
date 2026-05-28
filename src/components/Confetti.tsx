import './Confetti.css';

const COLORS = ['#f5e642', '#42f5a7', '#f54275', '#42a5f5', '#f5a742'];

export default function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.5,
    size: 4 + Math.random() * 8,
  }));

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  );
}
