import React, { useMemo } from 'react';

interface ConfettiPiece {
  id: number;
  left: number; // percentage
  size: number; // px
  color: string;
  delay: number; // seconds
  duration: number; // seconds
  rotate: number; // initial degrees
}

const COLORS = [
  '#ff72e5', // pink
  '#00c0f3', // cyan
  '#7b68ee', // purple
  '#f89d13', // orange
  '#10b981', // green
  '#facc15', // yellow
  '#ec4899', // rose
  '#3b82f6', // blue
  '#a855f7'  // violet
];

export const ConfettiCelebration: React.FC = () => {
  const pieces = useMemo(() => {
    const list: ConfettiPiece[] = [];
    for (let i = 0; i < 75; i++) {
      list.push({
        id: i,
        left: Math.random() * 98,
        size: 7 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 1.4,
        duration: 2.8 + Math.random() * 2.2,
        rotate: Math.random() * 360
      });
    }
    return list;
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9990,
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-20px) rotate(0deg) rotateX(0deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg) rotateX(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * (p.id % 2 === 0 ? 1 : 1.3)}px`,
            backgroundColor: p.color,
            borderRadius: p.id % 5 === 0 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`
          }}
        />
      ))}
    </div>
  );
};
