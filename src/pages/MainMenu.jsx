import React from 'react';
import { Link } from 'react-router-dom';

function PawnIcon({ color, highlight }) {
  return (
    <svg width="44" height="44" viewBox="0 0 40 40">
      <ellipse cx="20" cy="37.5" rx="9" ry="2" fill="rgba(0,0,0,0.25)" />
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

export default function MainMenu() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #c8a96e 0%, #a0722a 35%, #c8a96e 60%, #8B5E1A 80%, #b89050 100%)',
          boxShadow: '0 25px 60px rgba(100,60,10,0.45), inset 0 1px 0 rgba(255,220,150,0.3)',
          border: '3px solid #5c3610',
        }}
      >
        <div
          className="p-8 flex flex-col items-center gap-8"
          style={{
            background: 'repeating-linear-gradient(92deg, transparent, transparent 4px, rgba(0,0,0,0.025) 4px, rgba(0,0,0,0.025) 5px)',
          }}
        >
          {/* Title */}
          <div className="text-center">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: '#3b1a05', textShadow: '0 2px 4px rgba(255,180,80,0.3)', letterSpacing: -1, lineHeight: 1 }}>
              Quoridor
            </h1>
            <p style={{ color: '#7c3a10', fontSize: 13, marginTop: 6, fontFamily: 'var(--font-body)' }}>The wall-building strategy game</p>
          </div>

          {/* Pawns */}
          <div className="flex gap-8 items-center">
            <PawnIcon color="#7c2d12" highlight="#f97316" />
            <div style={{ width: 2, height: 40, background: 'rgba(100,50,10,0.35)', borderRadius: 1 }} />
            <PawnIcon color="#0c4a6e" highlight="#38bdf8" />
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3">
            <Link to="/game" className="block">
              <button
                className="w-full py-4 rounded-xl font-bold text-lg text-amber-50 active:scale-95 transition-transform"
                style={{
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(135deg, #92400e, #78350f)',
                  boxShadow: '0 4px 0 #451a03, 0 6px 16px rgba(0,0,0,0.35)',
                  border: '1.5px solid #5c2a0a',
                }}
              >
                ♟ Play vs Friend
              </button>
            </Link>

            <button
              disabled
              className="w-full py-4 rounded-xl font-bold text-lg"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'rgba(120,70,20,0.45)',
                background: 'rgba(0,0,0,0.08)',
                border: '2px dashed rgba(120,60,10,0.3)',
                cursor: 'not-allowed',
              }}
            >
              🤖 vs Computer <span style={{ fontSize: 11, fontWeight: 400 }}>(coming soon)</span>
            </button>
          </div>

          <p style={{ color: 'rgba(100,50,10,0.55)', fontSize: 11, textAlign: 'center', fontFamily: 'var(--font-body)' }}>
            Place pawns · Build walls · Reach the other side
          </p>
        </div>
      </div>
    </div>
  );
}
