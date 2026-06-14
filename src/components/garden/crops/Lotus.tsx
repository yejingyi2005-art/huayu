import type { CropStage } from "../../../lib/types";

const stages: Record<CropStage, { scale: number; petals: number; opacity: number }> = {
  seed: { scale: 0.3, petals: 0, opacity: 0.5 },
  sprout: { scale: 0.4, petals: 2, opacity: 0.6 },
  growing: { scale: 0.7, petals: 5, opacity: 0.85 },
  bloom: { scale: 1, petals: 8, opacity: 1 },
};

export function Lotus({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  const s = stages[stage];
  return (
    <svg viewBox="0 0 60 80" className={`${className} text-[#D4A0B0]`} style={{ transform: `scale(${s.scale})`, opacity: s.opacity }}>
      <path d="M30 25 Q30 45 30 75" stroke="#5A7A4A" strokeWidth="1.5" fill="none" opacity="0.6" />
      <ellipse cx="25" cy="55" rx="8" ry="4" fill="#5A7A4A" opacity="0.5" transform="rotate(-20 25 55)" />
      {s.petals >= 2 && (
        <>
          <path d="M30 22 Q18 10 22 2 Q30 8 30 22Z" fill="currentColor" opacity="0.85" />
          <path d="M30 22 Q42 10 38 2 Q30 8 30 22Z" fill="currentColor" opacity="0.8" />
        </>
      )}
      {s.petals >= 5 && (
        <>
          <path d="M30 22 Q14 16 14 8 Q22 12 30 22Z" fill="currentColor" opacity="0.75" />
          <path d="M30 22 Q46 16 46 8 Q38 12 30 22Z" fill="currentColor" opacity="0.75" />
          <path d="M30 22 Q22 4 30 0 Q38 4 30 22Z" fill="#E8B0C0" opacity="0.85" />
        </>
      )}
      {s.petals >= 8 && (
        <>
          <path d="M30 22 Q10 20 8 14 Q18 16 30 22Z" fill="currentColor" opacity="0.6" />
          <path d="M30 22 Q50 20 52 14 Q42 16 30 22Z" fill="currentColor" opacity="0.6" />
        </>
      )}
      <circle cx="30" cy="22" r="3" fill="#E8C040" opacity="0.8" />
      {s.petals === 0 && (
        <ellipse cx="30" cy="35" rx="4" ry="5" fill="#8B7E5A" opacity="0.6" />
      )}
    </svg>
  );
}
