"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

type Board = number[][];

const GRID_SIZE = 4;

const tileColors: Record<number, { bg: string; text: string }> = {
  0: { bg: "#cdc1b4", text: "#776e65" },
  2: { bg: "#eee4da", text: "#776e65" },
  4: { bg: "#ede0c8", text: "#776e65" },
  8: { bg: "#f2b179", text: "#f9f6f2" },
  16: { bg: "#f59563", text: "#f9f6f2" },
  32: { bg: "#f67c5f", text: "#f9f6f2" },
  64: { bg: "#f65e3b", text: "#f9f6f2" },
  128: { bg: "#edcf72", text: "#f9f6f2" },
  256: { bg: "#edcc61", text: "#f9f6f2" },
  512: { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
};

export default function Game2048() {
  const { user, addPoints } = useAuth();
  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  function initializeBoard(): Board {
    const newBoard: Board = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  function addRandomTile(board: Board): boolean {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length === 0) return false;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[row][col] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  function slideRow(row: number[]): { newRow: number[]; points: number } {
    let points = 0;
    // Filter out zeros
    let filtered = row.filter((x) => x !== 0);

    // Merge adjacent equal tiles
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        points += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    // Filter out zeros again and pad with zeros
    filtered = filtered.filter((x) => x !== 0);
    while (filtered.length < GRID_SIZE) {
      filtered.push(0);
    }

    return { newRow: filtered, points };
  }

  function moveLeft(board: Board): { newBoard: Board; points: number; moved: boolean } {
    let totalPoints = 0;
    let moved = false;
    const newBoard = board.map((row) => {
      const { newRow, points } = slideRow([...row]);
      totalPoints += points;
      if (newRow.join(",") !== row.join(",")) moved = true;
      return newRow;
    });
    return { newBoard, points: totalPoints, moved };
  }

  function moveRight(board: Board): { newBoard: Board; points: number; moved: boolean } {
    let totalPoints = 0;
    let moved = false;
    const newBoard = board.map((row) => {
      const reversed = [...row].reverse();
      const { newRow, points } = slideRow(reversed);
      totalPoints += points;
      const result = newRow.reverse();
      if (result.join(",") !== row.join(",")) moved = true;
      return result;
    });
    return { newBoard, points: totalPoints, moved };
  }

  function moveUp(board: Board): { newBoard: Board; points: number; moved: boolean } {
    let totalPoints = 0;
    let moved = false;
    const newBoard: Board = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));

    for (let col = 0; col < GRID_SIZE; col++) {
      const column = board.map((row) => row[col]);
      const { newRow, points } = slideRow(column);
      totalPoints += points;
      if (newRow.join(",") !== column.join(",")) moved = true;
      for (let row = 0; row < GRID_SIZE; row++) {
        newBoard[row][col] = newRow[row];
      }
    }
    return { newBoard, points: totalPoints, moved };
  }

  function moveDown(board: Board): { newBoard: Board; points: number; moved: boolean } {
    let totalPoints = 0;
    let moved = false;
    const newBoard: Board = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));

    for (let col = 0; col < GRID_SIZE; col++) {
      const column = board.map((row) => row[col]).reverse();
      const { newRow, points } = slideRow(column);
      totalPoints += points;
      const result = newRow.reverse();
      if (result.join(",") !== board.map((row) => row[col]).join(",")) moved = true;
      for (let row = 0; row < GRID_SIZE; row++) {
        newBoard[row][col] = result[row];
      }
    }
    return { newBoard, points: totalPoints, moved };
  }

  function checkGameOver(board: Board): boolean {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (j < GRID_SIZE - 1 && board[i][j] === board[i][j + 1]) return false;
        if (i < GRID_SIZE - 1 && board[i][j] === board[i + 1][j]) return false;
      }
    }
    return true;
  }

  function checkWon(board: Board): boolean {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 2048) return true;
      }
    }
    return false;
  }

  const handleMove = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameOver) return;

      let result: { newBoard: Board; points: number; moved: boolean };

      switch (direction) {
        case "left":
          result = moveLeft(board);
          break;
        case "right":
          result = moveRight(board);
          break;
        case "up":
          result = moveUp(board);
          break;
        case "down":
          result = moveDown(board);
          break;
      }

      if (result.moved) {
        const newBoard = result.newBoard;
        addRandomTile(newBoard);
        setBoard(newBoard);
        const newScore = score + result.points;
        setScore(newScore);
        if (newScore > bestScore) {
          setBestScore(newScore);
        }
        if (checkWon(newBoard) && !won) {
          setWon(true);
        }
        if (checkGameOver(newBoard)) {
          setGameOver(true);
        }
      }
    },
    [board, score, bestScore, gameOver, won]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace("Arrow", "").toLowerCase() as
          | "up"
          | "down"
          | "left"
          | "right";
        handleMove(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  // Award points when game ends
  useEffect(() => {
    if ((gameOver || won) && user && !pointsAwarded && score > 0) {
      const points = Math.floor(score / 100) + (won ? 100 : 0);
      if (points > 0) {
        addPoints("2048", points, { score, won });
        setPointsAwarded(true);
      }
    }
  }, [gameOver, won, user, pointsAwarded, score, addPoints]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setPointsAwarded(false);
  };

  const getTileStyle = (value: number) => {
    const colors = tileColors[value] || { bg: "#3c3a32", text: "#f9f6f2" };
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      fontSize: value >= 1024 ? "1.5rem" : value >= 128 ? "1.75rem" : "2rem",
    };
  };

  return (
    <div className="min-h-screen bg-[#faf8ef]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] py-4">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-between">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-2xl font-bold text-[#776e65]">2048</h1>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-[#8f7a66] text-white rounded-lg text-sm font-medium hover:bg-[#9f8b77] transition-colors"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-[#bbada0] rounded-lg px-6 py-3 text-center min-w-[100px]">
            <p className="text-xs text-[#eee4da] uppercase font-semibold">Score</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="bg-[#bbada0] rounded-lg px-6 py-3 text-center min-w-[100px]">
            <p className="text-xs text-[#eee4da] uppercase font-semibold">Best</p>
            <p className="text-2xl font-bold text-white">{bestScore}</p>
          </div>
        </div>

        {/* Board */}
        <div className="relative bg-[#bbada0] rounded-lg p-3">
          <div className="grid grid-cols-4 gap-3">
            {board.flat().map((value, index) => (
              <div
                key={index}
                className="aspect-square rounded-md flex items-center justify-center font-bold transition-all duration-100"
                style={getTileStyle(value)}
              >
                {value !== 0 && value}
              </div>
            ))}
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-white/80 rounded-lg flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-[#776e65] mb-4">Game Over!</p>
              <p className="text-lg text-[#776e65] mb-4">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-[#8f7a66] text-white rounded-lg font-semibold hover:bg-[#9f8b77] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Won Overlay */}
          {won && !gameOver && (
            <div className="absolute inset-0 bg-[#edc22e]/90 rounded-lg flex flex-col items-center justify-center">
              <p className="text-3xl font-bold text-white mb-4">You Win! 🎉</p>
              <p className="text-lg text-white mb-4">Score: {score}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setWon(false)}
                  className="px-6 py-3 bg-white text-[#776e65] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Keep Playing
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-[#8f7a66] text-white rounded-lg font-semibold hover:bg-[#9f8b77] transition-colors"
                >
                  New Game
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="mt-6 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div />
          <button
            onClick={() => handleMove("up")}
            className="aspect-square bg-[#8f7a66] text-white rounded-lg flex items-center justify-center hover:bg-[#9f8b77] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div />
          <button
            onClick={() => handleMove("left")}
            className="aspect-square bg-[#8f7a66] text-white rounded-lg flex items-center justify-center hover:bg-[#9f8b77] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => handleMove("down")}
            className="aspect-square bg-[#8f7a66] text-white rounded-lg flex items-center justify-center hover:bg-[#9f8b77] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleMove("right")}
            className="aspect-square bg-[#8f7a66] text-white rounded-lg flex items-center justify-center hover:bg-[#9f8b77] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold text-[#776e65] mb-3">How to Play</h3>
          <ul className="space-y-2 text-sm text-[#776e65]">
            <li>• Use arrow keys or buttons to move tiles</li>
            <li>• Tiles with the same number merge into one</li>
            <li>• Add them up to reach 2048!</li>
            <li>• The game ends when no moves are possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
