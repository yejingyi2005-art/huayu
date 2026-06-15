import type { CropStage } from "../../../lib/types";

export function Lotus({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <linearGradient id="lotusPetal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#F0C8D0" />
          <stop offset="40%" stopColor="#F8D8E0" />
          <stop offset="100%" stopColor="#FFE8F0" />
        </linearGradient>
        <linearGradient id="lotusTip" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#E8A0B0" />
          <stop offset="100%" stopColor="#F0C0D0" />
        </linearGradient>
        <radialGradient id="lotusCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8E060" />
          <stop offset="100%" stopColor="#D0A030" />
        </radialGradient>
        <linearGradient id="lotusLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5A9A5A" />
          <stop offset="100%" stopColor="#3A7A3A" />
        </linearGradient>
        <linearGradient id="lotusStemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A8A4A" />
          <stop offset="100%" stopColor="#3A6A2A" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A0C8D8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#80B0C0" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="95" rx="5" ry="8" fill="#3A2A1A" opacity="0.8" />
      )}
      {stage === "sprout" && (
        <>
          <rect x="30" y="105" width="60" height="2" fill="url(#waterGrad)" rx="1" />
          <path d="M60 105 Q58 85 60 72" stroke="url(#lotusStemGrad)" strokeWidth="2" fill="none" />
          <path d="M60 72 Q50 66 46 60 Q52 58 56 64 Q58 68 60 72Z" fill="#6AAA5A" opacity="0.7" />
          <path d="M60 72 Q70 66 74 60 Q68 58 64 64 Q62 68 60 72Z" fill="#5A9A4A" opacity="0.7" />
        </>
      )}
      {stage === "growing" && (
        <>
          <rect x="20" y="110" width="80" height="3" fill="url(#waterGrad)" rx="1.5" />
          <path d="M60 110 Q56 88 60 70" stroke="url(#lotusStemGrad)" strokeWidth="3" fill="none" />
          <path d="M60 70 Q40 52 36 46 Q44 40 52 50 Q56 60 60 70Z" fill="url(#lotusLeafGrad)" opacity="0.85" />
          <path d="M36 46 Q32 42 36 40" stroke="#3A7A3A" strokeWidth="0.8" fill="none" />
          <path d="M60 70 Q80 52 84 46 Q76 40 68 50 Q64 60 60 70Z" fill="#4A8A4A" opacity="0.8" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <rect x="15" y="118" width="90" height="3" fill="url(#waterGrad)" rx="1.5" />
          <path d="M60 118 Q55 90 60 56" stroke="url(#lotusStemGrad)" strokeWidth="3.5" fill="none" />
          <path d="M60 90 Q36 68 30 60 Q40 52 50 64 Q56 76 60 90Z" fill="url(#lotusLeafGrad)" opacity="0.9" />
          <path d="M60 90 Q84 68 90 60 Q80 52 70 64 Q64 76 60 90Z" fill="#4A8A4A" opacity="0.85" />
          <path d="M60 56 Q48 36 42 28 Q52 24 56 34 Q58 44 60 56Z" fill="url(#lotusPetal)" opacity="0.95" />
          <path d="M60 56 Q72 36 78 28 Q68 24 64 34 Q62 44 60 56Z" fill="url(#lotusPetal)" opacity="0.9" />
          <path d="M60 56 Q54 34 52 24 Q60 20 60 32 Q60 44 60 56Z" fill="url(#lotusTip)" opacity="0.95" />
          <path d="M60 56 Q66 34 68 24 Q60 20 60 32 Q60 44 60 56Z" fill="url(#lotusPetal)" opacity="0.85" />
          <path d="M60 56 Q44 30 38 20 Q50 18 54 28 Q58 40 60 56Z" fill="url(#lotusPetal)" opacity="0.7" />
          <path d="M60 56 Q76 30 82 20 Q70 18 66 28 Q62 40 60 56Z" fill="url(#lotusPetal)" opacity="0.7" />
          <circle cx="60" cy="48" r="4" fill="url(#lotusCenter)" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return <circle key={`st${i}`} cx={60 + Math.cos(a) * 2.5} cy={48 + Math.sin(a) * 2.5} r="0.8" fill="#D0A030" opacity="0.8" />;
          })}
        </>
      )}
    </svg>
  );
}
