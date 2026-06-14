import type { CropStage } from "../../../lib/types";

const stages: Record<CropStage, { scale: number; leaves: number; opacity: number }> = {
  seed: { scale: 0.3, leaves: 0, opacity: 0.5 },
  sprout: { scale: 0.5, leaves: 1, opacity: 0.7 },
  growing: { scale: 0.8, leaves: 2, opacity: 0.9 },
  bloom: { scale: 1, leaves: 4, opacity: 1 },
};

export function Clover({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  const s = stages[stage];
  return (
    <svg viewBox="0 0 60 80" className={`${className} text-[#5A7A4A]`} style={{ transform: `scale(${s.scale})`, opacity: s.opacity }}>
      {s.leaves >= 3 && (
        <>
          <path d="M30 45 Q20 20 30 10 Q40 20 30 45Z" fill="currentColor" opacity="0.85" />
          <path d="M30 45 Q10 30 8 18 Q18 18 30 45Z" fill="currentColor" opacity="0.8" />
          <path d="M30 45 Q50 30 52 18 Q42 18 30 45Z" fill="currentColor" opacity="0.8" />
        </>
      )}
      {s.leaves >= 4 && (
        <path d="M30 45 Q30 22 18 8 Q30 8 30 45Z" fill="currentColor" opacity="0.75" />
      )}
      {s.leaves >= 2 && s.leaves < 4 && (
        <>
          <path d="M30 40 Q20 22 30 14 Q40 22 30 40Z" fill="currentColor" opacity="0.8" />
          <path d="M30 40 Q15 28 14 20 Q22 20 30 40Z" fill="currentColor" opacity="0.75" />
        </>
      )}
      {s.leaves === 1 && (
        <path d="M30 40 Q22 26 30 18 Q38 26 30 40Z" fill="currentColor" opacity="0.7" />
      )}
      {s.leaves === 0 && (
        <ellipse cx="30" cy="35" rx="4" ry="5" fill="#8B7E5A" opacity="0.6" />
      )}
      <path d="M30 45 Q30 55 30 70" stroke="#5A7A4A" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}
