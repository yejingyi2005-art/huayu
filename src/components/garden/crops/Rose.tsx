import type { CropStage } from "../../../lib/types";

export function Rose({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <radialGradient id="roseGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F0C0C0" />
          <stop offset="40%" stopColor="#E8A0A0" />
          <stop offset="100%" stopColor="#D07070" />
        </radialGradient>
        <radialGradient id="roseDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D07070" />
          <stop offset="100%" stopColor="#B05050" />
        </radialGradient>
        <linearGradient id="roseLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5A8A4A" />
          <stop offset="100%" stopColor="#3A6A2A" />
        </linearGradient>
        <linearGradient id="stemRoseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A7A3A" />
          <stop offset="100%" stopColor="#2A5A1A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="85" rx="5" ry="7" fill="#5A3A2A" opacity="0.8" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 105 Q58 85 60 70" stroke="url(#stemRoseGrad)" strokeWidth="2" fill="none" />
          <path d="M60 70 Q48 62 44 56 Q52 52 56 60 Q58 66 60 70Z" fill="#5A7A4A" opacity="0.7" />
          <path d="M60 70 Q72 62 76 56 Q68 52 64 60 Q62 66 60 70Z" fill="#4A6A3A" opacity="0.7" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 120 Q56 90 60 58" stroke="url(#stemRoseGrad)" strokeWidth="3" fill="none" />
          <path d="M60 90 Q44 80 36 74" stroke="url(#stemRoseGrad)" strokeWidth="2" fill="none" />
          <path d="M36 74 Q28 64 30 56 Q38 52 40 62 Q42 68 36 74Z" fill="url(#roseLeafGrad)" opacity="0.8" />
          <path d="M36 74 Q40 72 42 74" stroke="#2A5A1A" strokeWidth="0.5" fill="none" />
          <path d="M60 72 Q76 62 84 56" stroke="url(#stemRoseGrad)" strokeWidth="2" fill="none" />
          <path d="M84 56 Q92 48 90 40 Q82 36 80 46 Q78 52 84 56Z" fill="url(#roseLeafGrad)" opacity="0.8" />
          <path d="M60 56 Q56 48 58 44" stroke="#3A6A2A" strokeWidth="1" fill="none" />
          <ellipse cx="60" cy="52" rx="5" ry="6" fill="#D07070" opacity="0.5" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 130 Q55 95 60 52" stroke="url(#stemRoseGrad)" strokeWidth="4" fill="none" />
          <path d="M60 105 Q40 92 30 84" stroke="url(#stemRoseGrad)" strokeWidth="2.5" fill="none" />
          <path d="M30 84 Q20 74 22 64 Q30 58 34 68 Q36 76 30 84Z" fill="url(#roseLeafGrad)" opacity="0.85" />
          <path d="M60 82 Q80 70 92 64" stroke="url(#stemRoseGrad)" strokeWidth="2.5" fill="none" />
          <path d="M92 64 Q102 56 100 46 Q92 42 88 52 Q86 58 92 64Z" fill="url(#roseLeafGrad)" opacity="0.85" />
          <path d="M52 62 Q44 40 48 34 Q56 30 58 40 Q56 52 52 62Z" fill="url(#roseGrad)" opacity="0.9" />
          <path d="M68 62 Q76 40 72 34 Q64 30 62 40 Q64 52 68 62Z" fill="url(#roseGrad)" opacity="0.85" />
          <path d="M60 66 Q50 50 52 38 Q60 32 60 42 Q60 54 60 66Z" fill="url(#roseGrad)" opacity="0.95" />
          <path d="M60 66 Q70 50 68 38 Q60 32 60 42 Q60 54 60 66Z" fill="url(#roseDark)" opacity="0.7" />
          <path d="M60 60 Q55 48 60 40 Q65 48 60 60Z" fill="#C06060" opacity="0.8" />
          <circle cx="60" cy="48" r="3" fill="#B05050" opacity="0.6" />
        </>
      )}
    </svg>
  );
}
