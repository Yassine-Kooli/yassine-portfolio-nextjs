"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AppProps } from "@/os/app-view";

const N = 20;
const SPEED = 110;
type P = { x: number; y: number };
const DIRS: Record<string, P> = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
};

const readBest = () => {
  try {
    return Number(localStorage.getItem("yassineos-serpent-best") ?? 0);
  } catch {
    return 0;
  }
};

export default function Snake({ active }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const game = useRef({ snake: [{ x: 10, y: 10 }] as P[], dir: { x: 1, y: 0 }, queue: [] as P[], food: { x: 15, y: 10 } });
  const [state, setState] = useState<"ready" | "running" | "paused" | "dead">("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => setBest(readBest()), []);
  useEffect(() => {
    if (active) rootRef.current?.focus({ preventScroll: true });
  }, [active]);
  // Auto-pause when the window loses focus
  useEffect(() => {
    if (!active) setState((s) => (s === "running" ? "paused" : s));
  }, [active]);

  const placeFood = (snake: P[]): P => {
    let f: P;
    do f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
    while (snake.some((p) => p.x === f.x && p.y === f.y));
    return f;
  };

  const reset = useCallback(() => {
    const snake = [{ x: 8, y: 10 }, { x: 7, y: 10 }, { x: 6, y: 10 }];
    game.current = { snake, dir: { x: 1, y: 0 }, queue: [], food: placeFood(snake) };
    setScore(0);
    setState("running");
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const s = c.width / N;
    ctx.fillStyle = "#0a0909";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgba(255,255,255,.03)";
    for (let i = 0; i <= N; i++) {
      ctx.beginPath(); ctx.moveTo(i * s, 0); ctx.lineTo(i * s, c.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * s); ctx.lineTo(c.width, i * s); ctx.stroke();
    }
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim().split(" ").join(",");
    const { snake, food } = game.current;
    ctx.fillStyle = "#efe8d8";
    ctx.shadowColor = "#efe8d8";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(food.x * s + s / 2, food.y * s + s / 2, s / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    snake.forEach((p, i) => {
      ctx.fillStyle = `rgba(${accent},${1 - (i / snake.length) * 0.6})`;
      ctx.fillRect(p.x * s + 1, p.y * s + 1, s - 2, s - 2);
    });
  }, []);

  useEffect(() => {
    draw();
    if (state !== "running") return;
    const t = setInterval(() => {
      const g = game.current;
      const nextDir = g.queue.shift();
      if (nextDir) g.dir = nextDir;
      const head = { x: g.snake[0].x + g.dir.x, y: g.snake[0].y + g.dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || g.snake.some((p) => p.x === head.x && p.y === head.y)) {
        setState("dead");
        setScore((sc) => {
          if (sc > readBest()) {
            try { localStorage.setItem("yassineos-serpent-best", String(sc)); } catch {}
            setBest(sc);
          }
          return sc;
        });
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        g.food = placeFood(g.snake);
        setScore((sc) => sc + 1);
      } else g.snake.pop();
      draw();
    }, SPEED);
    return () => clearInterval(t);
  }, [state, draw]);

  const onKey = (e: React.KeyboardEvent) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === " " || key === "Enter") {
      e.preventDefault();
      if (state === "running") setState("paused");
      else if (state === "paused") setState("running");
      else reset();
      return;
    }
    const d = DIRS[key];
    if (!d) return;
    e.preventDefault();
    const g = game.current;
    const last = g.queue[g.queue.length - 1] ?? g.dir;
    if (last.x + d.x === 0 && last.y + d.y === 0) return; // no reversing into yourself
    if (g.queue.length < 3) g.queue.push(d);
    if (state === "ready" || state === "dead") reset();
  };

  return (
    <div ref={rootRef} tabIndex={0} onKeyDown={onKey} className="flex h-full flex-col items-center justify-center gap-4 bg-crypt p-4 outline-none">
      <div className="flex w-full max-w-[400px] justify-between font-display text-sm tracking-widest text-ash-300">
        <span>SOULS {score}</span>
        <span>BEST {best}</span>
      </div>
      <div className="relative aspect-square w-full max-w-[400px]">
        <canvas ref={canvasRef} width={400} height={400} className="h-full w-full rounded-lg border border-white/5" onClick={() => state !== "running" && (state === "paused" ? setState("running") : reset())} />
        {state !== "running" && (
          <div className="absolute inset-0 grid place-items-center rounded-lg bg-black/60 text-center">
            <div>
              <div className="font-goth text-4xl text-parchment">{state === "dead" ? "Thou art slain" : state === "paused" ? "Paused" : "Serpent"}</div>
              <div className="mt-2 text-xs text-ash-300">{state === "paused" ? "Space to resume" : "Arrows / WASD to slither · Space or click to start"}</div>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1 sm:hidden">
        {[null, ["ArrowUp", "▲"], null, ["ArrowLeft", "◀"], ["ArrowDown", "▼"], ["ArrowRight", "▶"]].map((b, i) =>
          b ? (
            <button key={i} onClick={() => onKey({ key: b[0], preventDefault() {} } as React.KeyboardEvent)} className="h-12 w-12 rounded-lg bg-ash-800 text-bone active:bg-ash-700">
              {b[1]}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}
