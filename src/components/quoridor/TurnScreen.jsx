import React from "react";

const PLAYER_NAMES = ["Player 1", "Player 2"];
const PLAYER_COLORS = ["#c2410c", "#0369a1"];

export default function TurnScreen({ playerIndex, prevPlayerIndex, onDone }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "linear-gradient(135deg, #c8a96e, #a0722a, #8B5E1A)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onDone}
    >
      {prevPlayerIndex !== null && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "46%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(180deg)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "rgba(60,20,5,0.55)", fontSize: 11 }}>
              Turn over
            </p>
            <p style={{ color: PLAYER_COLORS[prevPlayerIndex], fontSize: 28, fontWeight: 800 }}>
              {PLAYER_NAMES[prevPlayerIndex]}
            </p>
          </div>
        </div>
      )}

      <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "rgba(60,20,5,0.25)" }} />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "46%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(60,20,5,0.55)", fontSize: 11 }}>
            Your turn
          </p>
          <p style={{ color: PLAYER_COLORS[playerIndex], fontSize: 36, fontWeight: 800 }}>
            {PLAYER_NAMES[playerIndex]}
          </p>
          <div
            style={{
              display: "inline-block",
              padding: "10px 28px",
              borderRadius: 10,
              background: "linear-gradient(135deg, #92400e, #78350f)",
              color: "#fef3c7",
              fontWeight: 700,
            }}
          >
            Tap anywhere to start
          </div>
        </div>
      </div>
    </div>
  );
}
