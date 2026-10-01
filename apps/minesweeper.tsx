"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { LuFlag, LuSkull } from "react-icons/lu";

const SIZE = 9;
const MINES = 10;

type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };

const empty = (): Cell[] => Array.from({ length: SIZE * SIZE }, () => ({ mine: false, open: false, flag: false, n: 0 }));
const neighbors = (i: number) => {
  const x = i % SIZE, y = Math.floor(i / SIZE), out: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE) out.push(ny * SIZE + nx);
    }
  return out;
};

// Mines are placed on the first click so it is always safe
function seed(first: number): Cell[] {
  const cells = empty();
  const banned = new Set([first, ...neighbors(first)]);
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * cells.length);
    if (cells[i].mine || banned.has(i)) continue;
    cells[i].mine = true;
    placed++;
  }
  cells.forEach((c, i) => (c.n = neighbors(i).filter((j) => cells[j].mine).length));
  return cells;
}

const numColor = ["", "text-[#8aa6b8]", "text-[#7d9a5a]", "text-[#d0584f]", "text-[#b07ab8]", "text-[#c98a3b]", "text-[#5fb0a8]", "text-bone", "text-ash-400"];

export default function Minesweeper() {
  const [cells, setCells] = useState<Cell[]>(empty);
  const [state, setState] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (state !== "playing") return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);

  const reset = () => {
    setCells(empty());
    setState("ready");
    setTime(0);
  };

  const reveal = (i: number) => {
    if (state === "won" || state === "lost") return;
    let board = cells.map((c) => ({ ...c }));
    if (state === "ready") {
      board = seed(i);
      setState("playing");
    }
    const c = board[i];
    if (c.flag || c.open) return;
    if (c.mine) {
      board.forEach((b) => b.mine && (b.open = true));
      setCells(board);
      setState("lost");
      return;
    }
    const stack = [i];
    while (stack.length) {
      const j = stack.pop()!;
      const cell = board[j];
      if (cell.open || cell.flag) continue;
      cell.open = true;
      if (cell.n === 0) stack.push(...neighbors(j));
    }
    setCells(board);
    if (board.every((b) => b.mine || b.open)) setState("won");
  };

  const flag = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "playing" || cells[i].open) return;
    setCells((cs) => cs.map((c, j) => (j === i ? { ...c, flag: !c.flag } : c)));
  };

  const flags = cells.filter((c) => c.flag).length;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-crypt p-4 text-bone">
      <div className="flex w-full max-w-[340px] items-center justify-between rounded-lg bg-black/40 px-4 py-2 font-display text-sm tracking-widest">
        <span className="flex items-center gap-1.5"><LuSkull size={14} className="text-accent" /> {MINES - flags}</span>
        <button onClick={reset} className="rounded-md px-3 py-1 text-xs transition hover:bg-white/10">
          {state === "lost" ? "RISE AGAIN" : state === "won" ? "PLAY AGAIN" : "NEW GAME"}
        </button>
        <span className="tabular-nums">{String(time).padStart(3, "0")}</span>
      </div>
      <div className="grid w-full max-w-[340px] gap-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
        {cells.map((c, i) => (
          <button
            key={i}
            onClick={() => reveal(i)}
            onContextMenu={(e) => flag(e, i)}
            className={clsx(
              "grid aspect-square place-items-center rounded text-sm font-bold transition",
              c.open
                ? c.mine ? "bg-accent/70 text-parchment" : "bg-black/50"
                : "bg-ash-700 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] hover:bg-ash-600",
            )}
          >
            {c.open ? (c.mine ? <LuSkull size={16} /> : c.n > 0 && <span className={numColor[c.n]}>{c.n}</span>) : c.flag && <LuFlag size={14} className="text-accent" />}
          </button>
        ))}
      </div>
      <p className="h-5 text-center text-xs text-ash-400">
        {state === "lost" ? "You disturbed the dead." : state === "won" ? `The graveyard rests. Cleared in ${time}s.` : "Click to dig · right-click to mark a grave"}
      </p>
    </div>
  );
}
