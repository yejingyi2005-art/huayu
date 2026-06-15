import type { CropStage } from "../../../lib/types";

export function Sunflower({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <radialGradient id="sunCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6B4A2A" />
          <stop offset="60%" stopColor="#4A2A10" />
          <stop offset="100%" stopColor="#3A1A08" />
        </radialGradient>
        <radialGradient id="sunCenterLight" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#8B6A3A" />
          <stop offset="100%" stopColor="#5A3A1A" />
        </radialGradient>
        <linearGradient id="petalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD644" />
          <stop offset="50%" stopColor="#F4B820" />
          <stop offset="100%" stopColor="#D9900A" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7AA85A" />
          <stop offset="100%" stopColor="#4A7A2A" />
        </linearGradient>
        <linearGradient id="stemSunGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A8A4A" />
          <stop offset="100%" stopColor="#3A6A2A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="85" rx="6" ry="10" fill="#4A3A2A" opacity="0.8" transform="rotate(-10 60 85)" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 100 Q58 80 60 65" stroke="url(#stemSunGrad)" strokeWidth="2" fill="none" />
          <ellipse cx="53" cy="62" rx="7" ry="5" fill="url(#leafGrad)" opacity="0.7" transform="rotate(-20 53 62)" />
          <ellipse cx="67" cy="64" rx="7" ry="5" fill="url(#leafGrad)" opacity="0.7" transform="rotate(20 67 64)" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 120 Q56 85 60 50" stroke="url(#stemSunGrad)" strokeWidth="4" fill="none" />
          <path d="M60 90 Q45 80 36 75" stroke="url(#stemSunGrad)" strokeWidth="2.5" fill="none" />
          <path d="M36 75 Q24 68 20 56 Q28 50 38 58 Q42 68 36 75Z" fill="url(#leafGrad)" opacity="0.8" />
          <path d="M60 70 Q75 60 84 55" stroke="url(#stemSunGrad)" strokeWidth="2.5" fill="none" />
          <path d="M84 55 Q96 48 98 38 Q88 34 80 42 Q76 50 84 55Z" fill="url(#leafGrad)" opacity="0.8" />
          <circle cx="60" cy="48" r="6" fill="url(#sunCenterLight)" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 130 Q56 90 60 48" stroke="url(#stemSunGrad)" strokeWidth="4.5" fill="none" />
          <path d="M60 100 Q42 88 32 82" stroke="url(#stemSunGrad)" strokeWidth="3" fill="none" />
          <path d="M32 82 Q18 72 16 58 Q26 50 36 60 Q42 72 32 82Z" fill="url(#leafGrad)" opacity="0.85" />
          <path d="M60 80 Q78 68 88 62" stroke="url(#stemSunGrad)" strokeWidth="3" fill="none" />
          <path d="M88 62 Q102 54 104 40 Q94 34 84 44 Q78 54 88 62Z" fill="url(#leafGrad)" opacity="0.85" />
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2 - Math.PI / 2;
            const ex = 60 + Math.cos(angle) * 22;
            const ey = 48 + Math.sin(angle) * 22;
            return (
              <ellipse
                key={i}
                cx={ex}
                cy={ey}
                rx="5"
                ry="14"
                fill="url(#petalGrad)"
                opacity="0.9"
                transform={`rotate(${(i * 360) / 14} 60 48)`}
              />
            );
          })}
          <circle cx="60" cy="48" r="10" fill="url(#sunCenter)" />
          <circle cx="60" cy="48" r="7" fill="url(#sunCenterLight)" opacity="0.5" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <circle key={`s${i}`} cx={60 + Math.cos(a) * 4} cy={48 + Math.sin(a) * 4} r="1.2" fill="#D9900A" opacity="0.7" />;
          })}
        </>
      )}
    </svg>
  );
}
