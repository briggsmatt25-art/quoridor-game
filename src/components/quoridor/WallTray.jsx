import React from "react";

function DraggableWall({ orientation, disabled, onDragStart, onTouchStart }) {
  const isH = orientation === "h";

  return (
    <div
      draggable={!disabled}
      onDragStart={
        disabled
          ? undefined
          : (e) => {
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("text/plain", orientation);
              onDragStart(orientation);
            }
      }
      onDragEnd={() => onDragStart(null)}
      onTouchStart={
        disabled
          ? undefined
          : (e) => {
              e.preventDefault();
              onTouchStart(orientation);
            }
      }
      title={isH ? "Horizontal wall — drag to board" : "Vertical wall — drag to board"}
      style={{
        width: isH ? 56 : 14,
        height: isH ? 14 : 56,
        borderRadius: 3,
        background: disabled
          ? "rgba(180,130,80,0.2)"
          : `linear-gradient(${isH ? "180deg" : "90deg"}, #b45309, #78350f, #b45309)`,
        boxShadow: disabled
          ? "none"
          : "0 2px 6px rgba(0,0,0,0.4), inset 0 1px rgba(255,200,100,0.2)",
        cursor: disabled ? "not-allowed" : "grab",
        border: disabled
          ? "1.5px dashed rgba(150,100,50,0.3)"
          : "1.5px solid #5c3610",
        flexShrink: 0,
        touchAction: "none",
      }}
    />
  );
}

export default function WallTray({
  wallsRemaining,
  currentPlayer,
  onDragStart,
  onTouchStart,
}) {
  const count = wallsRemaining[currentPlayer];
  const playerName = currentPlayer === 0 ? "Player 1" : "Player 2";
  const filled = Array.from({ length: 10 }, (_, i) => i < count);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        background: "linear-gradient(160deg, #c8a96e, #a0722a)",
        borderRadius: 12,
        border: "2px solid #5c3610",
        boxShadow: "0 4px 12px rgba(60,30,5,0.3)",
        minWidth: 80,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#451a03",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {playerName}
      </div>

      <div style={{ fontSize: 12, color: "#78350f", fontWeight: 600 }}>
        {count} wall{count !== 1 ? "s" : ""}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          maxWidth: 60,
        }}
      >
        {filled.map((f, i) => (
          <div
            key={i}
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: f
                ? "linear-gradient(135deg, #92400e, #78350f)"
                : "transparent",
              border: f
                ? "1px solid #5c3610"
                : "1px dashed rgba(100,50,10,0.35)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <div
          style={{
            fontSize: 9,
            color: "#78350f",
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          Drag:
        </div>

        <DraggableWall
          orientation="h"
          disabled={count === 0}
          onDragStart={onDragStart}
          onTouchStart={onTouchStart}
        />

        <DraggableWall
          orientation="v"
          disabled={count === 0}
          onDragStart={onDragStart}
          onTouchStart={onTouchStart}
        />
      </div>
    </div>
  );
}
