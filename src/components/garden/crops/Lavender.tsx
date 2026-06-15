import type { CropStage } from "../../../lib/types";

export function Lavender({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <linearGradient id="lavBloom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B0A0D0" />
          <stop offset="50%" stopColor="#9080B8" />
          <stop offset="100%" stopColor="#7060A0" />
        </linearGradient>
        <linearGradient id="lavTip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8B8E0" />
          <stop offset="100%" stopColor="#A090C8" />
        </linearGradient>
        <linearGradient id="lavLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6A9A5A" />
          <stop offset="100%" stopColor="#4A7A3A" />
        </linearGradient>
        <linearGradient id="lavStemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A8A4A" />
          <stop offset="100%" stopColor="#3A6A2A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="90" rx="4" ry="6" fill="#4A3A2A" opacity="0.8" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 105 Q58 88 60 72" stroke="url(#lavStemGrad)" strokeWidth="2" fill="none" />
          <path d="M60 72 Q52 64 48 58 Q54 56 56 64 Q58 68 60 72Z" fill="url(#lavLeafGrad)" opacity="0.7" />
          <path d="M60 72 Q68 64 72 58 Q66 56 64 64 Q62 68 60 72Z" fill="#4A7A3A" opacity="0.7" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 120 Q56 90 60 55" stroke="url(#lavStemGrad)" strokeWidth="2.5" fill="none" />
          <path d="M60 90 Q42 82 34 76" stroke="url(#lavStemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M34 76 Q24 68 24 62 Q30 58 32 66 Q34 72 34 76Z" fill="url(#lavLeafGrad)" opacity="0.75" />
          <path d="M60 78 Q78 70 86 64" stroke="url(#lavStemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M86 64 Q96 56 96 50 Q90 46 88 54 Q86 60 86 64Z" fill="#4A7A3A" opacity="0.75" />
          <path d="M60 70 Q44 64 38 58" stroke="url(#lavStemGrad)" strokeWidth="1" fill="none" />
          <path d="M38 58 Q30 52 30 48 Q34 44 36 52 Q38 56 38 58Z" fill="url(#lavLeafGrad)" opacity="0.6" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 130 Q55 100 60 42" stroke="url(#lavStemGrad)" strokeWidth="3" fill="none" />
          <path d="M60 100 Q38 90 28 84" stroke="url(#lavStemGrad)" strokeWidth="2" fill="none" />
          <path d="M28 84 Q16 74 16 66 Q24 60 28 70 Q30 78 28 84Z" fill="url(#lavLeafGrad)" opacity="0.85" />
          <path d="M60 86 Q82 76 92 70" stroke="url(#lavStemGrad)" strokeWidth="2" fill="none" />
          <path d="M92 70 Q104 62 102 54 Q96 50 92 60 Q90 66 92 70Z" fill="#4A7A3A" opacity="0.85" />
          {Array.from({ length: 6 }).map((_, i) => {
            const offset = i * 8;
            const w = Math.max(4, 12 - i);
            return (
              <ellipse
                key={i}
                cx={60}
                cy={50 + offset}
                rx={w}
                ry="3"
                fill={i < 3 ? "url(#lavTip)" : "url(#lavBloom)"}
                opacity={0.85 - i * 0.06}
                transform={`rotate(${i % 2 === 0 ? -2 : 2} 60 ${50 + offset})`}
              />
            );
          })}
          <path d="M60 42 Q58 38 58 34 Q60 32 60 36 Q60 40 60 42Z" fill="url(#lavTip)" opacity="0.9" />
          <path d="M60 42 Q62 38 62 34 Q60 32 60 36 Q60 40 60 42Z" fill="url(#lavBloom)" opacity="0.8" />
        </>
      )}
    </svg>
  );
}
