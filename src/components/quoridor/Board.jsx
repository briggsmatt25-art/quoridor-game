import React, { useMemo } from "react";
import { BOARD_SIZE, getValidMoves, isValidWallPlacement } from "@/lib/quoridorLogic";
import PawnSVG from "./PawnSVG";

const CELL_BASE = (r, c) => ((r + c) % 2 === 0 ? "#c8a96e" : "#b8945a");

export default function Board({ state, flipped, onCellClick, onWallDrop }) {
  const validMoves = useMemo(
    () => getValidMoves(state, state.currentPlayer),
    [state]
  );

  const toLogic = (dr, dc) =>
    flipped ? [BOARD_SIZE - 1 - dr, BOARD_SIZE - 1 - dc] : [dr, dc];

  const isValidMove = (r, c) =>
    validMoves.some((m) => m.row === r && m.col === c);

  const handleWallClick = (row, col) => {
    if (state.mode !== "wall") return;
    if (isValidWallPlacement(state, row, col, state.wallOrientation)) {
      onWallDrop(row, col, state.wallOrientation);
    }
  };

  const hasHWall = (lr, lc) =>
    state.walls.some(
      (w) =>
        w.orientation === "h" &&
        w.row === lr &&
        (w.col === lc || w.col === lc - 1)
    );

  const hasVWall = (lr, lc) =>
    state.walls.some(
      (w) =>
        w.orientation === "v" &&
        w.col === lc &&
        (w.row === lr || w.row === lr - 1)
    );

  const tracks = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    tracks.push("1fr");
    if (i < BOARD_SIZE - 1) tracks.push("10px");
  }

  const cells = [];
  for (let dr = 0; dr < BOARD_SIZE; dr++) {
    for (let dc = 0; dc < BOARD_SIZE; dc++) {
      const [lr, lc] = toLogic(dr, dc);
      const isP1 = state.players[0].row === lr && state.players[0].col === lc;
      const isP2 = state.players[1].row === lr && state.players[1].col === lc;
      const canMove = state.mode === "move" && isValidMove(lr, lc);

      cells.push(
        <div
          key={`c-${dr}-${dc}`}
          onClick={() => canMove && onCellClick(lr, lc)}
          style={{
            gridRow: dr * 2 + 1,
            gridColumn: dc * 2 + 1,
            background: canMove ? "rgba(74,222,128,0.4)" : CELL_BASE(dr, dc),
            boxShadow: canMove
              ? "inset 0 0 0 2px rgba(34,197,94,0.8)"
              : "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
            cursor: canMove ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "repeating-linear-gradient(89deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 6px)",
            }}
          />

          {isP1 && <PawnSVG color="#7c2d12" highlight="#f97316" />}
          {isP2 && <PawnSVG color="#0c4a6e" highlight="#38bdf8" />}

          {canMove && !isP1 && !isP2 && (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "rgba(34,197,94,0.65)",
                border: "2px solid rgba(21,128,61,0.9)",
                zIndex: 2,
              }}
            />
          )}
        </div>
      );
    }
  }

  const wallSlots = [];

  for (let dr = 0; dr < BOARD_SIZE - 1; dr++) {
    for (let dc = 0; dc < BOARD_SIZE; dc++) {
      const [lr1] = toLogic(dr, dc);
      const [lr2] = toLogic(dr + 1, dc);
      const lgr = Math.min(lr1, lr2);
      const [, lgc] = toLogic(dr, dc);
      const placed = hasHWall(lgr, lgc);
      const canPlace =
        state.mode === "wall" &&
        state.wallOrientation === "h" &&
        dc < BOARD_SIZE - 1 &&
        isValidWallPlacement(state, lgr, lgc, "h");

      wallSlots.push(
        <div
          key={`hg-${dr}-${dc}`}
          onClick={() => canPlace && handleWallClick(lgr, lgc)}
          style={{
            gridRow: dr * 2 + 2,
            gridColumn: dc * 2 + 1,
            background: placed
              ? "linear-gradient(180deg,#b45309,#78350f,#b45309)"
              : canPlace
              ? "rgba(180,100,20,0.75)"
              : "rgba(80,40,5,0.22)",
            borderRadius: 1,
            cursor: canPlace ? "pointer" : "default",
          }}
        />
      );
    }
  }

  for (let dr = 0; dr < BOARD_SIZE; dr++) {
    for (let dc = 0; dc < BOARD_SIZE - 1; dc++) {
      const [, lc1] = toLogic(dr, dc);
      const [, lc2] = toLogic(dr, dc + 1);
      const lgc = Math.min(lc1, lc2);
      const [lgr] = toLogic(dr, dc);
      const placed = hasVWall(lgr, lgc);
      const canPlace =
        state.mode === "wall" &&
        state.wallOrientation === "v" &&
        dr < BOARD_SIZE - 1 &&
        isValidWallPlacement(state, lgr, lgc, "v");

      wallSlots.push(
        <div
          key={`vg-${dr}-${dc}`}
          onClick={() => canPlace && handleWallClick(lgr, lgc)}
          style={{
            gridRow: dr * 2 + 1,
            gridColumn: dc * 2 + 2,
            background: placed
              ? "linear-gradient(90deg,#b45309,#78350f,#b45309)"
              : canPlace
              ? "rgba(180,100,20,0.75)"
              : "rgba(80,40,5,0.22)",
            borderRadius: 1,
            cursor: canPlace ? "pointer" : "default",
          }}
        />
      );
    }
  }

  for (let dr = 0; dr < BOARD_SIZE - 1; dr++) {
    for (let dc = 0; dc < BOARD_SIZE - 1; dc++) {
      wallSlots.push(
        <div
          key={`int-${dr}-${dc}`}
          style={{
            gridRow: dr * 2 + 2,
            gridColumn: dc * 2 + 2,
            background: "#6b3a0f",
            borderRadius: 2,
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "min(84vw, 420px)",
        aspectRatio: "1",
        background:
          "linear-gradient(135deg,#8B5E1A 0%,#a0722a 30%,#7a4f10 55%,#a0722a 80%,#8B5E1A 100%)",
        borderRadius: 14,
        padding: 8,
        boxShadow:
          "0 8px 32px rgba(60,30,5,0.5), inset 0 1px 0 rgba(255,220,150,0.25)",
        border: "3px solid #5c3610",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: tracks.join(" "),
          gridTemplateRows: tracks.join(" "),
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {cells}
        {wallSlots}
      </div>
    </div>
  );
}
