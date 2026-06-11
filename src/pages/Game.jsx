import React, { useCallback, useEffect, useState } from "react";
import { createInitialState, movePlayer, placeWall } from "@/lib/quoridorLogic";
import WallTray from "@/components/quoridor/WallTray";
import Board from "@/components/quoridor/Board";
import PlayerInfo from "@/components/quoridor/PlayerInfo";
import TurnScreen from "@/components/quoridor/TurnScreen";
import WinnerScreen from "@/components/quoridor/WinnerScreen";

function loadScores() {
  try {
    const raw = localStorage.getItem("quoridor_scores");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [0, 0];
}

function saveScores(scores) {
  localStorage.setItem("quoridor_scores", JSON.stringify(scores));
}

export default function Game() {
  const [gameState, setGameState] = useState(createInitialState);
  const [scores, setScores] = useState(loadScores);
  const [showTurnScreen, setShowTurnScreen] = useState(false);
  const [prevPlayer, setPrevPlayer] = useState(null);

  useEffect(() => {
    saveScores(scores);
  }, [scores]);

  const handleCellClick = useCallback((row, col) => {
    setGameState((prev) => {
      const next = movePlayer(prev, row, col);
      if (!next) return prev;

      if (next.winner !== null) {
        setScores((s) => {
          const updated = [...s];
          updated[next.winner] += 1;
          return updated;
        });
        return next;
      }

      setPrevPlayer(prev.currentPlayer);
      //setShowTurnScreen(false);
      return next;
    });
  }, []);

  const handleWallDrop = useCallback((row, col, orientation) => {
    setGameState((prev) => {
      const next = placeWall(prev, row, col, orientation);
      if (!next) return prev;

      setPrevPlayer(prev.currentPlayer);
      //setShowTurnScreen(false);
      return next;
    });
  }, []);

  const handleSetMode = useCallback((mode) => {
    setGameState((prev) => ({ ...prev, mode }));
  }, []);

  const handleSetOrientation = useCallback((orientation) => {
    setGameState((prev) => ({ ...prev, wallOrientation: orientation }));
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState(createInitialState());
    setShowTurnScreen(false);
    setPrevPlayer(null);
  }, []);

  const handleResetScores = useCallback(() => {
    setScores([0, 0]);
  }, []);

  const flipped = gameState.currentPlayer === 1;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-6">
      {gameState.winner !== null && (
        <WinnerScreen
          winnerIndex={gameState.winner}
          scores={scores}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {showTurnScreen && gameState.winner === null && (
        <TurnScreen
          playerIndex={gameState.currentPlayer}
          prevPlayerIndex={prevPlayer}
          onDone={() => setShowTurnScreen(false)}
        />
      )}

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Quoridor
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Reach the opposite side to win
        </p>
      </div>

      <div className="w-full max-w-md space-y-2 mb-4">
        <PlayerInfo
          playerIndex={flipped ? 0 : 1}
          wallsRemaining={gameState.wallsRemaining[flipped ? 0 : 1]}
          isActive={false}
          score={scores[flipped ? 0 : 1]}
        />
      </div>

      <Board
        state={gameState}
        flipped={flipped}
        onCellClick={handleCellClick}
        onWallDrop={handleWallDrop}
        dragOrientation={gameState.wallOrientation}
      />

      <div className="w-full max-w-md space-y-2 mt-4">
        <PlayerInfo
          playerIndex={gameState.currentPlayer}
          wallsRemaining={gameState.wallsRemaining[gameState.currentPlayer]}
          isActive={true}
          score={scores[gameState.currentPlayer]}
        />
      </div>
      <WallTray
  wallsRemaining={gameState.wallsRemaining}
  currentPlayer={gameState.currentPlayer}
  onDragStart={setDragOrientation}
  onTouchStart={handleTouchStartOnTray}
/>

      
    </div>
  );
}
