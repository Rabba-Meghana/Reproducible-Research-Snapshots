import React from 'react';

export default function ScoreRing({ score, size = 80, strokeWidth = 6 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? 'var(--accent-green)' : score >= 65 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const label = score >= 85 ? 'HIGH' : score >= 65 ? 'PARTIAL' : 'LOW';

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter:`drop-shadow(0 0 6px ${color})` }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          style={{ fill:color, fontSize:size*0.26, fontFamily:'var(--font-mono)', fontWeight:700,
            transform:'rotate(90deg)', transformOrigin:'center' }}>
          {score}
        </text>
      </svg>
      <span style={{ fontSize:9, letterSpacing:'0.15em', color, fontFamily:'var(--font-mono)', fontWeight:700 }}>
        {label}
      </span>
    </div>
  );
}
