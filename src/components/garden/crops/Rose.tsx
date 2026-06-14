import type { CropStage } from "../../../lib/types";

const stages: Record<CropStage, { scale: number; layers: number; opacity: number }> = {
  seed: { scale: 0.3, layers: 0, opacity: 0.5 },
  sprout: { scale: 0.4, layers: 1, opacity: 0.6 },
  growing: { scale: 0.7, layers: 2, opacity: 0.85 },
  bloom: { scale: 1, layers: 4, opacity: 1 },
};

export function Rose({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  const s = stages[stage];
  return (
    <svg viewBox="0 0 60 80" className={`${className} text-[#B45A6A]`} style={{ transform: `scale(${s.scale})`, opacity: s.opacity }}>
      <path d="M30 30 Q30 50 30 75" stroke="#5A7A4A" strokeWidth="1.5" fill="none" opacity="0.7" />
      {s.layers >= 1 && (
        <path d="M18 28 Q14 18 24 14 Q30 18 30 24 Q30 18 36 14 Q46 18 42 28 Q36 30 30 28 Q24 30 18 28Z" fill="#D47A8A" opacity="0.85" />
      )}
      {s.layers >= 2 && (
        <path d="M22 24 Q20 16 28 12 Q32 16 32 20 Q32 16 38 12 Q46 16 42 24 Q36 26 30 22 Q24 26 22 24Z" fill="#C46A7A" opacity="0.8" />
      )}
      {s.layers >= 3 && (
        <path d="M25 20 Q24 14 30 10 Q36 14 34 20 Q30 22 25 20Z" fill="#B45A6A" opacity="0.75" />
      )}
      {s.layers >= 4 && (
        <path d="M28 16 Q28 12 30 10 Q32 12 32 16 Q30 18 28 16Z" fill="#A04A5A" opacity="0.7" />
      )}
      <path d="M20 30 Q15 36 10 34" stroke="#5A7A4A" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M40 28 Q45 34 50 32" stroke="#5A7A4A" strokeWidth="1" fill="none" opacity="0.5" />
      {s.layers === 0 && (
        <ellipse cx="30" cy="35" rx="4" ry="5" fill="#8B7E5A" opacity="0.6" />
      )}
    </svg>
  );
}
