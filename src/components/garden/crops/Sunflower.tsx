import type { CropStage } from "../../../lib/types";

const stages: Record<CropStage, { scale: number; petals: number; stemH: number; opacity: number }> = {
  seed: { scale: 0.3, petals: 0, stemH: 0, opacity: 0.5 },
  sprout: { scale: 0.4, petals: 0, stemH: 20, opacity: 0.6 },
  growing: { scale: 0.7, petals: 5, stemH: 35, opacity: 0.85 },
  bloom: { scale: 1, petals: 12, stemH: 50, opacity: 1 },
};

export function Sunflower({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  const s = stages[stage];
  const cx = 30, cy = s.stemH > 0 ? 15 : 30;
  return (
    <svg viewBox="0 0 60 80" className={`${className} text-[#C4A035]`} style={{ transform: `scale(${s.scale})`, opacity: s.opacity }}>
      {s.stemH > 0 && (
        <path d={`M30 ${cy + 12} Q30 ${cy + 12 + s.stemH * 0.5} 30 80`} stroke="#5A7A4A" strokeWidth="2" fill="none" opacity="0.7" />
      )}
      {s.petals > 0 && (
        <>
          {Array.from({ length: s.petals }).map((_, i) => {
            const angle = (i / s.petals) * Math.PI * 2 - Math.PI / 2;
            const ex = cx + Math.cos(angle) * 16;
            const ey = cy + Math.sin(angle) * 16;
            return <ellipse key={i} cx={ex} cy={ey} rx="4" ry="2.5" fill="currentColor" opacity="0.85" transform={`rotate(${(i * 360) / s.petals} ${cx} ${cy})`} />;
          })}
          <circle cx={cx} cy={cy} r="7" fill="#5A3A1A" opacity="0.8" />
          <circle cx={cx} cy={cy} r="4" fill="#3A2010" opacity="0.6" />
        </>
      )}
      {s.petals === 0 && s.stemH > 0 && (
        <ellipse cx="30" cy={cy + 12} rx="3" ry="4" fill="#5A7A4A" opacity="0.6" />
      )}
      {s.petals === 0 && s.stemH === 0 && (
        <ellipse cx="30" cy="35" rx="4" ry="5" fill="#8B7E5A" opacity="0.6" />
      )}
    </svg>
  );
}
