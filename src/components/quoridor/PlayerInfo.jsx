import React from 'react';

const PLAYER_NAMES = ['Player 1', 'Player 2'];

export default function PlayerInfo({ playerIndex, wallsRemaining, isActive, score }) {
  const isP1 = playerIndex === 0;
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        borderRadius: 12,
        background: isActive
          ? (isP1 ? 'rgba(124,45,18,0.12)' : 'rgba(12,74,110,0.12)')
          : 'rgba(0,0,0,0.04)',
        border: isActive
          ? `2px solid ${isP1 ? 'rgba(194,65,12,0.5)' : 'rgba(3,105,161,0.5)'}`
          : '2px solid transparent',
        transform: isActive ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.25s',
        opacity: isActive ? 1 : 0.65,
      }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: isP1 ? 'linear-gradient(135deg,#c2410c,#7c2d12)' : 'linear-gradient(135deg,#0369a1,#0c4a6e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-heading)',
      }}>
        {playerIndex + 1}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'hsl(var(--foreground))', fontFamily: 'var(--font-heading)' }}>
          {PLAYER_NAMES[playerIndex]}
        </div>
        <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-body)' }}>
          {wallsRemaining} walls · {score} wins
        </div>
      </div>
      {isActive && (
        <div style={{
          width: 9, height: 9, borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 6px rgba(34,197,94,0.8)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      )}
    </div>
  );
}
