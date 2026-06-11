import React, { useMemo } from "react";
import {
  BOARD_SIZE,
  getValidMoves,
  isValidWallPlacement,
} from "@/lib/quoridorLogic";
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

  const tracks = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    tracks.push("1fr");
    if (i < BOARD_SIZE - 1) tracks.push("10px");
  }

  const template = tracks.join(" ");

  const cells = [];

  for (let dr = 0; dr < BOARD_SIZE; dr++) {
    for (let dc = 0; dc < BOARD_SIZE; dc++) {
      const [lr, lc] = toLogic(dr, dc);

      const isP1 =
        state.players[0].row === lr &&
        state.players[0].col === lc;

      const isP2 =
        state.players[1].row === lr &&
        state.players[1].col === lc;

      const canMove =
        state.mode === "move" &&
        isValidMove(lr, lc);

      cells.push(
        <div
          key={`cell-${dr}-${dc}`}
          onClick={() => canMove && onCellClick(lr, lc)}
          style={{
            gridRow: dr * 2 + 1,
            gridColumn: dc * 2 + 1,
            background: canMove
              ? "rgba(34,197,94,0.25)"
              : CELL_BASE(dr, dc),
            cursor: canMove ? "pointer" : "default",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {canMove && !isP1 && !isP2 && (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#22c55e",
              }}
            />
          )}

          {isP1 && (
            <PawnSVG
              color="#7c2d12"
              highlight="#f97316"
            />
          )}

          {isP2 && (
            <PawnSVG
              color="#0c4a6e"
              highlight="#38bdf8"
            />
          )}
        </div>
      );
    }
  }

  const walls = [];

  state.walls.forEach((wall, index) => {
    if (wall.orientation === "h") {
      walls.push(
        <div
          key={`wall-h-${index}`}
          style={{
            gridRow: wall.row * 2 + 2,
            gridColumn: `${wall.col * 2 + 1} / ${wall.col * 2 + 4}`,
            background:
              "linear-gradient(180deg,#f59e0b,#78350f,#f59e0b)",
            borderRadius: 3,
            zIndex: 10,
          }}
        />
      );
    }

    if (wall.orientation === "v") {
      walls.push(
        <div
          key={`wall-v-${index}`}
          style={{
            gridColumn: wall.col * 2 + 2,
            gridRow: `${wall.row * 2 + 1} / ${wall.row * 2 + 4}`,
            background:
              "linear-gradient(90deg,#f59e0b,#78350f,#f59e0b)",
            borderRadius: 3,
            zIndex: 10,
          }}
        />
      );
    }
  });

  const wallSlots = [];

  if (state.mode === "wall") {
    for (let row = 0; row < BOARD_SIZE - 1; row++) {
      for (let col = 0; col < BOARD_SIZE - 1; col++) {
        if (
          state.wallOrientation === "h" &&
          isValidWallPlacement(state, row, col, "h")
        ) {
          wallSlots.push(
            <div
              key={`slot-h-${row}-${col}`}
              onClick={() =>
                onWallDrop(row, col, "h")
              }
              style={{
                gridRow: row * 2 + 2,
                gridColumn: `${col * 2 + 1} / ${col * 2 + 4}`,
                cursor: "pointer",
                background: "transparent",
                zIndex: 5,
              }}
            />
          );
        }

        if (
          state.wallOrientation === "v" &&
          isValidWallPlacement(state, row, col, "v")
        ) {
          wallSlots.push(
            <div
              key={`slot-v-${row}-${col}`}
              onClick={() =>
                onWallDrop(row, col, "v")
              }
              style={{
                gridColumn: col * 2 + 2,
                gridRow: `${row * 2 + 1} / ${row * 2 + 4}`,
                cursor: "pointer",
                background: "transparent",
                zIndex: 5,
              }}
            />
          );
        }
      }
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        aspectRatio: 1,
        padding: 8,
        borderRadius: 14,
        border: "3px solid #5c3610",
        background:
          "linear-gradient(135deg,#8B5E1A,#a0722a,#8B5E1A)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: template,
          gridTemplateRows: template,
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        {cells}
        {wallSlots}
        {walls}
      </div>
    </div>
  );
}
