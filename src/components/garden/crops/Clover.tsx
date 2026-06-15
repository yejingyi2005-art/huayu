import type { CropStage } from "../../../lib/types";

export function Clover({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <radialGradient id="cloverGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6B8F5E" />
          <stop offset="100%" stopColor="#4A7A3A" />
        </radialGradient>
        <radialGradient id="cloverLight" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#8FB87A" />
          <stop offset="100%" stopColor="#5A8A4A" />
        </radialGradient>
        <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B8F5E" />
          <stop offset="100%" stopColor="#4A6B3A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="80" rx="8" ry="10" fill="#6B5A3A" opacity="0.8" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 95 Q58 75 60 65" stroke="url(#stemGrad)" strokeWidth="2" fill="none" />
          <ellipse cx="52" cy="62" rx="8" ry="6" fill="url(#cloverLight)" opacity="0.85" transform="rotate(-15 52 62)" />
          <ellipse cx="68" cy="60" rx="8" ry="6" fill="url(#cloverLight)" opacity="0.85" transform="rotate(15 68 60)" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 110 Q56 85 60 60" stroke="url(#stemGrad)" strokeWidth="2.5" fill="none" />
          <path d="M60 50 Q42 38 30 44" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M60 50 Q78 38 90 44" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M60 50 Q60 30 56 26" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M30 44 Q22 36 24 28 Q30 24 36 30 Q38 38 30 44Z" fill="url(#cloverLight)" opacity="0.8" />
          <path d="M90 44 Q98 36 96 28 Q90 24 84 30 Q82 38 90 44Z" fill="url(#cloverLight)" opacity="0.8" />
          <path d="M56 26 Q52 14 56 10 Q62 8 64 16 Q60 22 56 26Z" fill="url(#cloverLight)" opacity="0.8" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 115 Q55 85 60 55" stroke="url(#stemGrad)" strokeWidth="2.5" fill="none" />
          <path d="M60 48 Q38 32 24 40" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M60 48 Q82 32 96 40" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M60 48 Q60 26 54 20" stroke="url(#stemGrad)" strokeWidth="1.5" fill="none" />
          <path d="M60 48 Q78 40 84 28" stroke="url(#stemGrad)" strokeWidth="1.2" fill="none" />
          <path d="M24 40 Q14 30 16 18 Q22 12 30 20 Q34 32 24 40Z" fill="url(#cloverLight)" opacity="0.8" />
          <path d="M96 40 Q106 30 104 18 Q98 12 90 20 Q86 32 96 40Z" fill="url(#cloverLight)" opacity="0.8" />
          <path d="M54 20 Q48 6 54 2 Q62 0 66 8 Q60 16 54 20Z" fill="url(#cloverLight)" opacity="0.8" />
          <path d="M84 28 Q92 16 88 8 Q80 6 78 16 Q78 22 84 28Z" fill="url(#cloverGrad)" opacity="0.7" />
          <circle cx="60" cy="44" r="4" fill="#FFF8F0" opacity="0.9" />
          <circle cx="56" cy="40" r="2" fill="#FFE4CC" opacity="0.8" />
          <circle cx="64" cy="40" r="2" fill="#FFE4CC" opacity="0.8" />
          <circle cx="60" cy="36" r="2" fill="#FFE4CC" opacity="0.8" />
        </>
      )}
    </svg>
  );
}
