import type { CropStage } from "../../../lib/types";

export function ChinaRose({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <radialGradient id="chinaGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F8D0C0" />
          <stop offset="40%" stopColor="#F0A080" />
          <stop offset="100%" stopColor="#E08060" />
        </radialGradient>
        <radialGradient id="chinaDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E07050" />
          <stop offset="100%" stopColor="#C05030" />
        </radialGradient>
        <linearGradient id="chinaLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A8A3A" />
          <stop offset="100%" stopColor="#2A6A1A" />
        </linearGradient>
        <linearGradient id="chinaStemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A7A2A" />
          <stop offset="100%" stopColor="#1A5A0A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="85" rx="4" ry="6" fill="#4A2A1A" opacity="0.8" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 100 Q58 82 60 68" stroke="url(#chinaStemGrad)" strokeWidth="2" fill="none" />
          <path d="M60 68 Q52 60 48 54 Q54 50 58 58 Q60 64 60 68Z" fill="url(#chinaLeafGrad)" opacity="0.7" />
          <path d="M60 68 Q68 62 72 56 Q66 52 62 58 Q60 64 60 68Z" fill="#3A7A2A" opacity="0.7" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 115 Q56 85 60 56" stroke="url(#chinaStemGrad)" strokeWidth="3" fill="none" />
          <path d="M60 85 Q42 76 34 70" stroke="url(#chinaStemGrad)" strokeWidth="2" fill="none" />
          <path d="M34 70 Q24 60 26 52 Q34 48 36 58 Q38 64 34 70Z" fill="url(#chinaLeafGrad)" opacity="0.8" />
          <path d="M60 68 Q78 60 86 54" stroke="url(#chinaStemGrad)" strokeWidth="2" fill="none" />
          <path d="M86 54 Q96 46 94 38 Q86 34 84 44 Q82 50 86 54Z" fill="#3A7A2A" opacity="0.8" />
          <path d="M60 56 Q56 48 58 44 Q62 42 62 48 Q62 52 60 56Z" fill="#E08060" opacity="0.4" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 130 Q55 95 60 48" stroke="url(#chinaStemGrad)" strokeWidth="4" fill="none" />
          <path d="M60 100 Q38 86 28 78" stroke="url(#chinaStemGrad)" strokeWidth="2.5" fill="none" />
          <path d="M28 78 Q16 68 18 58 Q26 52 30 62 Q32 70 28 78Z" fill="url(#chinaLeafGrad)" opacity="0.85" />
          <path d="M60 82 Q82 70 92 64" stroke="url(#chinaStemGrad)" strokeWidth="2.5" fill="none" />
          <path d="M92 64 Q104 56 102 46 Q94 42 90 52 Q88 58 92 64Z" fill="#3A7A2A" opacity="0.85" />
          <path d="M60 48 Q48 30 50 22 Q56 20 58 28 Q60 36 60 48Z" fill="url(#chinaGrad)" opacity="0.95" />
          <path d="M60 48 Q72 30 70 22 Q64 20 62 28 Q60 36 60 48Z" fill="url(#chinaDark)" opacity="0.8" />
          <path d="M60 48 Q54 28 56 18 Q60 16 60 26 Q60 36 60 48Z" fill="url(#chinaGrad)" opacity="0.9" />
          <path d="M60 48 Q66 28 64 18 Q60 16 60 26 Q60 36 60 48Z" fill="url(#chinaDark)" opacity="0.7" />
          <path d="M60 48 Q46 34 48 24 Q54 22 56 30 Q58 38 60 48Z" fill="url(#chinaGrad)" opacity="0.8" />
          <path d="M60 48 Q74 34 72 24 Q66 22 64 30 Q62 38 60 48Z" fill="#E08060" opacity="0.7" />
          <circle cx="60" cy="34" r="3" fill="#D06040" opacity="0.6" />
        </>
      )}
    </svg>
  );
}
