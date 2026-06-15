import type { CropStage } from "../../../lib/types";

export function Orchid({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <radialGradient id="orchidGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F0D8E8" />
          <stop offset="50%" stopColor="#E0A8D0" />
          <stop offset="100%" stopColor="#C880B0" />
        </radialGradient>
        <radialGradient id="orchidLip" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#FFE8F0" />
          <stop offset="40%" stopColor="#F0A0C0" />
          <stop offset="100%" stopColor="#D06090" />
        </radialGradient>
        <linearGradient id="orchidLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3A7A3A" />
          <stop offset="100%" stopColor="#1A5A1A" />
        </linearGradient>
        <linearGradient id="orchidStemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A8A4A" />
          <stop offset="100%" stopColor="#2A6A2A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="90" rx="3" ry="5" fill="#5A4A2A" opacity="0.7" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 105 Q58 90 60 78" stroke="url(#orchidStemGrad)" strokeWidth="2" fill="none" />
          <path d="M60 78 Q48 70 44 64 Q50 60 54 68 Q58 72 60 78Z" fill="url(#orchidLeafGrad)" opacity="0.7" />
          <ellipse cx="60" cy="78" rx="2" ry="4" fill="#3A7A3A" opacity="0.5" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 120 Q56 90 60 56" stroke="url(#orchidStemGrad)" strokeWidth="3" fill="none" />
          <path d="M60 90 Q46 80 40 74 Q46 70 52 78 Q56 84 60 90Z" fill="url(#orchidLeafGrad)" opacity="0.8" />
          <path d="M60 90 Q74 80 80 74 Q74 70 68 78 Q64 84 60 90Z" fill="#2A6A2A" opacity="0.8" />
          <path d="M60 74 Q48 66 42 60 Q48 56 54 64 Q58 68 60 74Z" fill="#3A7A3A" opacity="0.7" />
          <path d="M60 74 Q72 66 78 60 Q72 56 66 64 Q62 68 60 74Z" fill="#2A6A2A" opacity="0.7" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 130 Q55 100 60 50" stroke="url(#orchidStemGrad)" strokeWidth="3.5" fill="none" />
          <path d="M60 100 Q42 88 34 82" stroke="url(#orchidStemGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M60 100 Q78 88 86 82" stroke="url(#orchidStemGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M60 90 Q44 80 38 74 Q44 70 50 78 Q56 84 60 90Z" fill="url(#orchidLeafGrad)" opacity="0.85" />
          <path d="M60 90 Q76 80 82 74 Q76 70 70 78 Q64 84 60 90Z" fill="#2A6A2A" opacity="0.85" />
          <path d="M60 50 Q52 34 50 26 Q56 22 58 30 Q60 38 60 50Z" fill="url(#orchidGrad)" opacity="0.95" />
          <path d="M60 50 Q68 34 70 26 Q64 22 62 30 Q60 38 60 50Z" fill="url(#orchidGrad)" opacity="0.85" />
          <path d="M60 50 Q56 32 56 24 Q60 22 60 32 Q60 40 60 50Z" fill="url(#orchidLip)" opacity="0.95" />
          <path d="M60 50 Q64 32 64 24 Q60 22 60 32 Q60 40 60 50Z" fill="url(#orchidLip)" opacity="0.7" />
          <path d="M60 50 Q48 36 46 28 Q52 26 54 34 Q58 40 60 50Z" fill="#E0A8D0" opacity="0.7" />
          <path d="M60 50 Q72 36 74 28 Q68 26 66 34 Q62 40 60 50Z" fill="#C880B0" opacity="0.7" />
          <circle cx="60" cy="38" r="2.5" fill="#D06090" opacity="0.7" />
          <circle cx="58" cy="36" r="1" fill="#FFE8F0" opacity="0.9" />
          <circle cx="62" cy="36" r="1" fill="#FFE8F0" opacity="0.9" />
        </>
      )}
    </svg>
  );
}
