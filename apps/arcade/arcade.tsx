"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import type { AppProps } from "@/os/app-view";
import Snake from "@/apps/arcade/snake";
import Minesweeper from "@/apps/arcade/minesweeper";

// Three.js is only loaded when the Arcade is opened
const Stack3D = dynamic(() => import("@/apps/arcade/stack-3d"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-crypt" />,
});

const GAMES = [
  { id: "stack", label: "Stack 3D", badge: "3D" },
  { id: "snake", label: "Snake" },
  { id: "minesweeper", label: "Minesweeper" },
] as const;
type GameId = (typeof GAMES)[number]["id"];

/** Game hub. Games stay mounted when switching tabs so progress is kept; only the visible game runs. */
export default function Arcade({ active }: AppProps) {
  const [tab, setTab] = useState<GameId>("stack");

  return (
    <div className="flex h-full flex-col bg-crypt text-bone">
      <div role="tablist" aria-label="Games" className="flex shrink-0 gap-1 border-b border-white/5 px-2 py-2">
        {GAMES.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={tab === g.id}
            onClick={() => setTab(g.id)}
            className={clsx(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition",
              tab === g.id ? "bg-white/10 text-parchment" : "text-ash-400 hover:bg-white/5 hover:text-bone",
            )}
          >
            {g.label}
            {"badge" in g && <span className="rounded bg-accent/20 px-1.5 py-px text-[10px] font-semibold text-accent">{g.badge}</span>}
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1">
        <div role="tabpanel" hidden={tab !== "stack"} className="absolute inset-0">
          <Stack3D active={active && tab === "stack"} />
        </div>
        <div role="tabpanel" hidden={tab !== "snake"} className="absolute inset-0">
          <Snake active={active && tab === "snake"} />
        </div>
        <div role="tabpanel" hidden={tab !== "minesweeper"} className="absolute inset-0">
          <Minesweeper />
        </div>
      </div>
    </div>
  );
}
