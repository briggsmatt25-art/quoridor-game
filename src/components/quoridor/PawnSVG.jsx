import React from 'react';

export default function PawnSVG({ color, highlight, size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.45))' }}>
      <ellipse cx="20" cy="37.5" rx="9" ry="2" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="20" cy="34" rx="9" ry="3" fill={color} />
      <path d="M11 34 Q11 20 14 16 Q17 13 20 13 Q23 13 26 16 Q29 20 29 34 Z" fill={color} />
      <path d="M13 30 Q13 20 15.5 17 Q17.5 14.5 20 14.5 Q16 16 14.5 22 Q13.5 26 13.5 30 Z" fill={highlight} opacity="0.2" />
      <ellipse cx="20" cy="13" rx="5" ry="3.5" fill={color} />
      <ellipse cx="20" cy="10" rx="7" ry="6.5" fill={color} />
      <ellipse cx="17.5" cy="7" rx="3.5" ry="2.5" fill={highlight} opacity="0.3" />
      <circle cx="17" cy="6.5" r="1.2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
