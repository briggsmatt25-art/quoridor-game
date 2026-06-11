import React, { useState, useMemo, useRef, useCallback } from 'react';
import { BOARD_SIZE, getValidMoves, isValidWallPlacement } from '@/lib/quoridorLogic';
import PawnSVG from './PawnSVG';

// Checkerboard warm wood tones
const CELL_BASE = (r, c) => (r + c) % 2 === 0 ? '#c8a96e' : '#b8945a';

export default function Board({ state, flipped, onCellClick, onWallDrop, dragOrientation }) {
  const [hoverWall, setHoverWall] = useState(null);
  const boardRef = useRef(null);

  const validMoves = useMemo(() => getValidMoves(state, state.currentPlayer), [state]);

  const toLogic = useCallback((dr, dc) =>
    flipped ? [BOARD_SIZE - 1 - dr, BOARD_SIZE - 1 - dc] : [dr, dc],
  [flipped]);

  const toLogicInt = useCallback((dr, dc) =>
    flipped ? [BOARD_SIZE - 2 - dr, BOARD_SIZE - 2 - dc] : [dr, dc],
  [flipped]);

  const isValidMove = (r, c) => validMoves.some(m => m.row === r && m.col === c);

  const hasHWall = (lr, lc) =>
    state.walls.some(w => w.orientation === 'h' && w.row === lr && (w.col === lc || w.col === lc - 1));

  const hasVWall = (lr, lc) =>
    state.walls.some(w => w.orientation === 'v' && w.col === lc && (w.row === lr || w.row === lr - 1));

  // Get intersection from a pointer position over the board
  const getIntFromPoint = useCallback((clientX, clientY) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const cw = rect.width / BOARD_SIZE;
    const ch = rect.height / BOARD_SIZE;
    const rx = clientX - rect.left;
    const ry = clientY - rect.top;

    // find nearest intersection
    let best = null, bestD = Infinity;
    for (let dr = 0; dr < BOARD_SIZE - 1; dr++) {
      for (let dc = 0; dc < BOARD_SIZE - 1; dc++) {
        const ix = (dc + 1) * cw;
        const iy = (dr + 1) * ch;
        const d = Math.abs(rx - ix) + Math.abs(ry - iy);
        if (d < bestD) { bestD = d; best = { dr, dc }; }
      }
    }
    return best && bestD < Math.min(cw, ch) * 1.5 ? best : null;
  }, []);

  const applyHover = useCallback((clientX, clientY, orient) => {
    const pt = getIntFromPoint(clientX, clientY);
    if (!pt) { setHoverWall(null); return; }
    const [lr, lc] = toLogicInt(pt.dr, pt.dc);
    const valid = isValidWallPlacement(state, lr, lc, orient);
    setHoverWall({ row: lr, col: lc, orientation: orient, valid });
  }, [getIntFromPoint, toLogicInt, state]);

  // Drag handlers (mouse)
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!dragOrientation) return;
    applyHover(e.clientX, e.clientY, dragOrientation);
  }, [dragOrientation, applyHover]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (hoverWall?.valid) onWallDrop(hoverWall.row, hoverWall.col, hoverWall.orientation);
    setHoverWall(null);
  }, [hoverWall, onWallDrop]);

  // Touch drag support
  const touchOrient = useRef(null);
  const handleTouchMove = useCallback((e) => {
    if (!touchOrient.current) return;
    e.preventDefault();
    const t = e.touches[0];
    applyHover(t.clientX, t.clientY, touchOrient.current);
  }, [applyHover]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    if (hoverWall?.valid) onWallDrop(hoverWall.row, hoverWall.col, hoverWall.orientation);
    setHoverWall(null);
    touchOrient.current = null;
  }, [hoverWall, onWallDrop]);

  // Expose touch orient setter via ref callback
  const setTouchOrient = useCallback((o) => { touchOrient.current = o; }, []);

  // Grid tracks: cells 1fr, gaps 10px (thicker = more visible walls)
  const tracks = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    tracks.push('1fr');
    if (i < BOARD_SIZE - 1) tracks.push('10px');
  }
  const tpl = tracks.join(' ');

  // ---- Render cells ----
  const cells = [];
  for (let dr = 0; dr < BOARD_SIZE; dr++) {
    for (let dc = 0; dc < BOARD_SIZE; dc++) {
      const [lr, lc] = toLogic(dr, dc);
      const isP1 = state.players[0].row === lr && state.players[0].col === lc;
      const isP2 = state.players[1].row === lr && state.players[1].col === lc;
      const canMove = isValidMove(lr, lc);

      cells.push(
        <div
          key={`c-${dr}-${dc}`}
          onClick={() => canMove && onCellClick(lr, lc)}
          style={{
            gridRow: dr * 2 + 1, gridColumn: dc * 2 + 1,
            background: canMove ? 'rgba(74,222,128,0.4)' : CELL_BASE(dr, dc),
            boxShadow: canMove ? 'inset 0 0 0 2px rgba(34,197,94,0.8)' : 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
            cursor: canMove ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Wood grain */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(89deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 6px)',
          }} />
          {isP1 && <PawnSVG color="#7c2d12" highlight="#f97316" />}
          {isP2 && <PawnSVG color="#0c4a6e" highlight="#38bdf8" />}
          {canMove && !isP1 && !isP2 && (
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(34,197,94,0.65)', border: '2px solid rgba(21,128,61,0.9)', zIndex: 2 }} />
          )}
        </div>
      );
    }
  }

  // ---- Render wall slots (gaps + intersections) ----
  const wallSlots = [];

  // Horizontal gaps
  for (let dr = 0; dr < BOARD_SIZE - 1; dr++) {
    for (let dc = 0; dc < BOARD_SIZE; dc++) {
      const [lr1] = toLogic(dr, dc);
      const [lr2] = toLogic(dr + 1, dc);
      const lgr = Math.min(lr1, lr2);
      const [, lgc] = toLogic(dr, dc);
      const placed = hasHWall(lgr, lgc);
      const hovering = hoverWall?.orientation === 'h' && hoverWall.row === lgr && (hoverWall.col === lgc || hoverWall.col === lgc - 1);

      wallSlots.push(
        <div key={`hg-${dr}-${dc}`} style={{
          gridRow: dr * 2 + 2, gridColumn: dc * 2 + 1,
          background: placed
            ? 'linear-gradient(180deg,#b45309,#78350f,#b45309)'
            : hovering
              ? (hoverWall.valid ? 'rgba(180,100,20,0.75)' : 'rgba(220,50,50,0.55)')
              : 'rgba(80,40,5,0.22)',
          borderRadius: 1,
          boxShadow: placed ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
          transition: 'background 0.1s',
        }} />
      );
    }
  }

  // Vertical gaps
  for (let dr = 0; dr < BOARD_SIZE; dr++) {
    for (let dc = 0; dc < BOARD_SIZE - 1; dc++) {
      const [, lc1] = toLogic(dr, dc);
      const [, lc2] = toLogic(dr, dc + 1);
      const lgc = Math.min(lc1, lc2);
      const [lgr] = toLogic(dr, dc);
      const placed = hasVWall(lgr, lgc);
      const hovering = hoverWall?.orientation === 'v' && hoverWall.col === lgc && (hoverWall.row === lgr || hoverWall.row === lgr - 1);

      wallSlots.push(
        <div key={`vg-${dr}-${dc}`} style={{
          gridRow: dr * 2 + 1, gridColumn: dc * 2 + 2,
          background: placed
            ? 'linear-gradient(90deg,#b45309,#78350f,#b45309)'
            : hovering
              ? (hoverWall.valid ? 'rgba(180,100,20,0.75)' : 'rgba(220,50,50,0.55)')
              : 'rgba(80,40,5,0.22)',
          borderRadius: 1,
          boxShadow: placed ? '1px 0 4px rgba(0,0,0,0.4)' : 'none',
          transition: 'background 0.1s',
        }} />
      );
    }
  }

  // Intersections — color matches wall if a placed wall passes through, otherwise dark dot
  for (let dr = 0; dr < BOARD_SIZE - 1; dr++) {
    for (let dc = 0; dc < BOARD_SIZE - 1; dc++) {
      const [lr, lc] = toLogicInt(dr, dc);
      // A horizontal wall covers this intersection if it passes through (row=lr, col=lc or lc-1 but intersection is at col boundary lc)
      const hWallThrough = state.walls.some(w => w.orientation === 'h' && w.row === lr && (w.col === lc || w.col === lc - 1));
      const vWallThrough = state.walls.some(w => w.orientation === 'v' && w.col === lc && (w.row === lr || w.row === lr - 1));
      const wallThrough = hWallThrough || vWallThrough;
      // Hover check
      const hHover = hoverWall?.orientation === 'h' && hoverWall.row === lr && (hoverWall.col === lc || hoverWall.col === lc - 1);
      const vHover = hoverWall?.orientation === 'v' && hoverWall.col === lc && (hoverWall.row === lr || hoverWall.row === lr - 1);
      const hoverThrough = hHover || vHover;

      wallSlots.push(
        <div key={`int-${dr}-${dc}`} style={{
          gridRow: dr * 2 + 2, gridColumn: dc * 2 + 2,
          background: wallThrough
            ? 'linear-gradient(135deg,#b45309,#78350f)'
            : hoverThrough
              ? (hoverWall.valid ? 'rgba(180,100,20,0.75)' : 'rgba(220,50,50,0.55)')
              : '#6b3a0f',
          borderRadius: 2,
          transition: 'background 0.1s',
        }} />
      );
    }
  }

  return (
    <div
      ref={boardRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setHoverWall(null)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-set-touch-orient={setTouchOrient}
      style={{
        width: '100%',
        maxWidth: 'min(84vw, 420px)',
        aspectRatio: '1',
        background: 'linear-gradient(135deg,#8B5E1A 0%,#a0722a 30%,#7a4f10 55%,#a0722a 80%,#8B5E1A 100%)',
        borderRadius: 14,
        padding: 8,
        boxShadow: '0 8px 32px rgba(60,30,5,0.5), inset 0 1px 0 rgba(255,220,150,0.25)',
        border: '3px solid #5c3610',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        display: 'grid',
        gridTemplateColumns: tpl,
        gridTemplateRows: tpl,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        {cells}
        {wallSlots}
      </div>
    </div>
  );
}
