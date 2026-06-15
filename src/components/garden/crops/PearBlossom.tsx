import type { CropStage } from "../../../lib/types";

export function PearBlossom({ stage = "bloom", className = "" }: { stage?: CropStage; className?: string }) {
  return (
    <svg viewBox="0 0 120 160" className={className}>
      <defs>
        <radialGradient id="pearPetal" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFF8F0" />
          <stop offset="100%" stopColor="#F0E8D8" />
        </radialGradient>
        <radialGradient id="pearCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8E060" />
          <stop offset="100%" stopColor="#D0A830" />
        </radialGradient>
        <linearGradient id="pearLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5A8A4A" />
          <stop offset="100%" stopColor="#3A6A2A" />
        </linearGradient>
        <linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6A5A4A" />
          <stop offset="50%" stopColor="#8A7A5A" />
          <stop offset="100%" stopColor="#5A4A3A" />
        </linearGradient>
        <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7A6A5A" />
          <stop offset="100%" stopColor="#5A4A3A" />
        </linearGradient>
      </defs>
      {stage === "seed" && (
        <ellipse cx="60" cy="95" rx="4" ry="6" fill="#4A3A2A" opacity="0.8" />
      )}
      {stage === "sprout" && (
        <>
          <path d="M60 105 Q58 90 60 75" stroke="url(#barkGrad)" strokeWidth="2" fill="none" />
          <path d="M60 75 Q50 66 46 60 Q52 56 56 64 Q58 70 60 75Z" fill="url(#pearLeafGrad)" opacity="0.7" />
          <path d="M60 75 Q70 66 74 60 Q68 56 64 64 Q62 70 60 75Z" fill="#4A7A3A" opacity="0.7" />
        </>
      )}
      {stage === "growing" && (
        <>
          <path d="M60 125 Q58 100 60 60" stroke="url(#barkGrad)" strokeWidth="4" fill="none" />
          <path d="M60 90 Q44 82 36 78" stroke="url(#branchGrad)" strokeWidth="2" fill="none" />
          <path d="M36 78 Q26 68 26 60 Q34 56 36 66 Q38 72 36 78Z" fill="url(#pearLeafGrad)" opacity="0.8" />
          <path d="M60 80 Q76 72 84 68" stroke="url(#branchGrad)" strokeWidth="2" fill="none" />
          <path d="M84 68 Q94 60 94 52 Q86 48 84 58 Q82 64 84 68Z" fill="#4A7A3A" opacity="0.8" />
          <path d="M60 70 Q48 62 42 56 Q48 52 54 60 Q58 66 60 70Z" fill="#5A8A4A" opacity="0.7" />
        </>
      )}
      {stage === "bloom" && (
        <>
          <path d="M60 135 Q56 105 60 52" stroke="url(#barkGrad)" strokeWidth="4.5" fill="none" />
          <path d="M60 95 Q42 85 32 78" stroke="url(#branchGrad)" strokeWidth="2.5" fill="none" />
          <path d="M32 78 Q20 68 20 58 Q28 52 32 62 Q34 70 32 78Z" fill="url(#pearLeafGrad)" opacity="0.85" />
          <path d="M60 82 Q78 74 88 68" stroke="url(#branchGrad)" strokeWidth="2.5" fill="none" />
          <path d="M88 68 Q100 60 100 50 Q92 46 88 56 Q86 62 88 68Z" fill="#4A7A3A" opacity="0.85" />
          <path d="M60 68 Q46 58 40 50 Q46 46 52 54 Q56 62 60 68Z" fill="#5A8A4A" opacity="0.7" />
          {([[32, 62], [52, 48], [68, 46], [82, 52], [60, 38], [46, 56], [74, 54]] as [number, number][]).map(([cx, cy], i) => (
            <g key={i}>
              {Array.from({ length: 5 }).map((_, j) => {
                const a = (j / 5) * Math.PI * 2 - Math.PI / 2;
                return (
                  <ellipse
                    key={j}
                    cx={cx + Math.cos(a) * 5}
                    cy={cy + Math.sin(a) * 5}
                    rx="4"
                    ry="7"
                    fill="url(#pearPetal)"
                    opacity="0.9"
                    transform={`rotate(${(j * 360) / 5 + 15} ${cx} ${cy})`}
                  />
                );
              })}
              <circle cx={cx} cy={cy} r="2.5" fill="url(#pearCenter)" />
              {Array.from({ length: 3 }).map((_, j) => {
                const a2 = (j / 3) * Math.PI * 2;
                return <circle key={`a${j}`} cx={cx + Math.cos(a2) * 1.5} cy={cy + Math.sin(a2) * 1.5} r="0.6" fill="#D0A830" opacity="0.8" />;
              })}
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
