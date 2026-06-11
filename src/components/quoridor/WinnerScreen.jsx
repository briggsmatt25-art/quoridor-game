import React from 'react';
import { Trophy } from 'lucide-react';

const PLAYER_NAMES = ['Player 1', 'Player 2'];
const PLAYER_COLORS = ['#c2410c', '#0369a1'];

export default function WinnerScreen({ winnerIndex, scores, onPlayAgain }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #c8a96e, #a0722a, #8B5E1A)',
        border: '3px solid #5c3610',
        borderRadius: 24,
        padding: '40px 48px',
        textAlign: 'center',
        boxShadow: '0 24px 60px rgba(60,30,5,0.5)',
        minWidth: 280,
      }}>
        <Trophy size={52} style={{ color: '#fbbf24', margin: '0 auto 16px', filter: 'drop-shadow(0 2px 6px rgba(251,191,36,0.5))' }} />
        <p style={{ color: 'rgba(60,20,5,0.6)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
          Winner
        </p>
        <h1 style={{ color: PLAYER_COLORS[winnerIndex], fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 20, lineHeight: 1.1 }}>
          {PLAYER_NAMES[winnerIndex]}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#3b1a05', fontFamily: 'var(--font-heading)' }}>{scores[0]}</div>
            <div style={{ fontSize: 12, color: 'rgba(60,20,5,0.6)' }}>P1 Wins</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#3b1a05', fontFamily: 'var(--font-heading)' }}>{scores[1]}</div>
            <div style={{ fontSize: 12, color: 'rgba(60,20,5,0.6)' }}>P2 Wins</div>
          </div>
        </div>
        <button
          onClick={onPlayAgain}
          style={{
            padding: '14px 40px', borderRadius: 12, fontWeight: 700, fontSize: 16,
            fontFamily: 'var(--font-heading)', color: '#fef3c7',
            background: 'linear-gradient(135deg, #92400e, #78350f)',
            border: '1.5px solid #5c3610',
            boxShadow: '0 4px 0 #451a03, 0 6px 16px rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
