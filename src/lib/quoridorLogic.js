// Quoridor game logic - pure functions, no React

export const BOARD_SIZE = 9;
export const INITIAL_WALLS = 10;

export function createInitialState() {
  return {
    players: [
      { row: 0, col: 4 }, // Player 1 starts top
      { row: 8, col: 4 }, // Player 2 starts bottom
    ],
    walls: [], // { row, col, orientation: 'h' | 'v' }
    wallsRemaining: [INITIAL_WALLS, INITIAL_WALLS],
    currentPlayer: 0, // 0 or 1
    winner: null,
    mode: 'move', // 'move' or 'wall'
    wallOrientation: 'h',
  };
}

export function isWallAt(walls, row, col, orientation) {
  return walls.some(w => w.row === row && w.col === col && w.orientation === orientation);
}

// Check if a wall blocks movement between two adjacent cells
export function isBlocked(walls, fromRow, fromCol, toRow, toCol) {
  const dr = toRow - fromRow;
  const dc = toCol - fromCol;

  if (dr === -1 && dc === 0) {
    // Moving up: blocked by horizontal wall at (fromRow-1, fromCol-1) or (fromRow-1, fromCol)
    return walls.some(w => w.orientation === 'h' && w.row === fromRow - 1 && (w.col === fromCol - 1 || w.col === fromCol));
  }
  if (dr === 1 && dc === 0) {
    // Moving down: blocked by horizontal wall at (fromRow, fromCol-1) or (fromRow, fromCol)
    return walls.some(w => w.orientation === 'h' && w.row === fromRow && (w.col === fromCol - 1 || w.col === fromCol));
  }
  if (dc === -1 && dr === 0) {
    // Moving left: blocked by vertical wall at (fromRow-1, fromCol-1) or (fromRow, fromCol-1)
    return walls.some(w => w.orientation === 'v' && w.col === fromCol - 1 && (w.row === fromRow - 1 || w.row === fromRow));
  }
  if (dc === 1 && dr === 0) {
    // Moving right: blocked by vertical wall at (fromRow-1, fromCol) or (fromRow, fromCol)
    return walls.some(w => w.orientation === 'v' && w.col === fromCol && (w.row === fromRow - 1 || w.row === fromRow));
  }
  return false;
}

export function getValidMoves(state, playerIndex) {
  const player = state.players[playerIndex];
  const opponent = state.players[1 - playerIndex];
  const { row, col } = player;
  const moves = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;

    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) continue;
    if (isBlocked(state.walls, row, col, nr, nc)) continue;

    // Check if opponent is in the way
    if (nr === opponent.row && nc === opponent.col) {
      // Try to jump over opponent
      const jr = nr + dr;
      const jc = nc + dc;
      if (jr >= 0 && jr < BOARD_SIZE && jc >= 0 && jc < BOARD_SIZE && !isBlocked(state.walls, nr, nc, jr, jc)) {
        moves.push({ row: jr, col: jc });
      } else {
        // Can't jump straight, try diagonal
        const laterals = dr === 0 ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]];
        for (const [lr, lc] of laterals) {
          const diagR = nr + lr;
          const diagC = nc + lc;
          if (diagR >= 0 && diagR < BOARD_SIZE && diagC >= 0 && diagC < BOARD_SIZE && !isBlocked(state.walls, nr, nc, diagR, diagC)) {
            moves.push({ row: diagR, col: diagC });
          }
        }
      }
    } else {
      moves.push({ row: nr, col: nc });
    }
  }

  return moves;
}

// BFS to check if a player can reach their goal row
function canReachGoal(walls, startRow, startCol, goalRow) {
  const visited = new Set();
  const queue = [[startRow, startCol]];
  visited.add(`${startRow},${startCol}`);

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    if (r === goalRow) return true;

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) continue;
      if (visited.has(key)) continue;
      if (isBlocked(walls, r, c, nr, nc)) continue;
      visited.add(key);
      queue.push([nr, nc]);
    }
  }
  return false;
}

export function isValidWallPlacement(state, row, col, orientation) {
  // Check bounds: walls span 2 cells
  if (orientation === 'h' && (row < 0 || row >= BOARD_SIZE - 1 || col < 0 || col >= BOARD_SIZE - 2)) return false;
  if (orientation === 'v' && (row < 0 || row >= BOARD_SIZE - 2 || col < 0 || col >= BOARD_SIZE - 1)) return false;

  // Check overlap with existing walls
  for (const w of state.walls) {
    if (w.orientation === orientation) {
      if (orientation === 'h' && w.row === row && Math.abs(w.col - col) <= 1) return false;
      if (orientation === 'v' && w.col === col && Math.abs(w.row - row) <= 1) return false;
    }
    // Check cross overlap (walls crossing at the same intersection)
    if (w.orientation !== orientation && w.row === row && w.col === col) return false;
  }

  // Check that both players can still reach their goals
  const newWalls = [...state.walls, { row, col, orientation }];
  const p1CanReach = canReachGoal(newWalls, state.players[0].row, state.players[0].col, BOARD_SIZE - 1);
  const p2CanReach = canReachGoal(newWalls, state.players[1].row, state.players[1].col, 0);

  return p1CanReach && p2CanReach;
}

export function movePlayer(state, targetRow, targetCol) {
  const validMoves = getValidMoves(state, state.currentPlayer);
  const isValid = validMoves.some(m => m.row === targetRow && m.col === targetCol);
  if (!isValid) return null;

  const newPlayers = state.players.map((p, i) =>
    i === state.currentPlayer ? { row: targetRow, col: targetCol } : p
  );

  // Check win condition: Player 1 wins by reaching row 8, Player 2 wins by reaching row 0
  let winner = null;
  if (state.currentPlayer === 0 && targetRow === BOARD_SIZE - 1) winner = 0;
  if (state.currentPlayer === 1 && targetRow === 0) winner = 1;

  return {
    ...state,
    players: newPlayers,
    currentPlayer: winner !== null ? state.currentPlayer : 1 - state.currentPlayer,
    winner,
    mode: 'move',
  };
}

export function placeWall(state, row, col, orientation) {
  if (state.wallsRemaining[state.currentPlayer] <= 0) return null;
  if (!isValidWallPlacement(state, row, col, orientation)) return null;

  return {
    ...state,
    walls: [...state.walls, { row, col, orientation }],
    wallsRemaining: state.wallsRemaining.map((w, i) => i === state.currentPlayer ? w - 1 : w),
    currentPlayer: 1 - state.currentPlayer,
    mode: 'move',
  };
}
