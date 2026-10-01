"use client";

import { memo, useId, useMemo } from "react";
import type { WallpaperId } from "@/store/system";

// Deterministic PRNG so the forest is identical between server and client renders
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function spruce(x: number, base: number, h: number, w: number, rand: () => number) {
  const top = base - h;
  const tiers = 7 + Math.floor(rand() * 5);
  const right: string[] = [];
  const left: string[] = [];
  for (let i = 1; i <= tiers; i++) {
    const t = i / tiers;
    const y = top + h * 0.92 * t;
    const hw = (w / 2) * t * (0.85 + rand() * 0.3);
    const notch = (h / tiers) * 0.35;
    right.push(`${x + hw},${y}`, `${x + hw * 0.32},${y - notch}`);
    left.unshift(`${x - hw * 0.32},${y - notch}`, `${x - hw},${y}`);
  }
  return `M${x},${top} L${right.join(" L")} L${x + w * 0.04},${base} L${x - w * 0.04},${base} L${left.join(" L")} Z`;
}

function forestLayer(seed: number, count: number, base: number, minH: number, maxH: number) {
  const rand = rng(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    const x = (i / count) * 2000 - 40 + rand() * 60;
    const h = minH + rand() * (maxH - minH);
    d += spruce(x, base + rand() * 20, h, h * (0.3 + rand() * 0.12), rand);
  }
  return d + `M-50,${base + 10} L1970,${base + 10} L1970,1100 L-50,1100 Z`;
}

function ridge(seed: number, base: number, amp: number) {
  const rand = rng(seed);
  let d = `M-20,1100 L-20,${base}`;
  for (let x = 0; x <= 1960; x += 40) d += ` L${x},${base - rand() * amp - Math.sin(x / 260) * amp * 0.6}`;
  return d + " L1960,1100 Z";
}

function deadTree(x: number, base: number, h: number, seed: number) {
  const rand = rng(seed);
  const lines: string[] = [];
  const branch = (x1: number, y1: number, len: number, angle: number, depth: number) => {
    if (depth === 0 || len < 6) return;
    const x2 = x1 + Math.cos(angle) * len;
    const y2 = y1 + Math.sin(angle) * len;
    lines.push(`M${x1},${y1} L${x2},${y2}`);
    const n = 2 + Math.floor(rand() * 2);
    for (let i = 0; i < n; i++) branch(x2, y2, len * (0.55 + rand() * 0.2), angle + (rand() - 0.5) * 1.4, depth - 1);
  };
  branch(x, base, h * 0.42, -Math.PI / 2, 6);
  return lines.join(" ");
}

function Fog({ animate, opacity = 1 }: { animate: boolean; opacity?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ opacity }}>
      <div
        className={`absolute -inset-x-1/4 bottom-[18%] h-[40%] ${animate ? "animate-drift" : ""}`}
        style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(160,155,150,.16), transparent 65%)", filter: "blur(20px)" }}
      />
      <div
        className={`absolute -inset-x-1/4 bottom-[4%] h-[35%] ${animate ? "animate-drift-slow" : ""}`}
        style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(140,135,130,.14), transparent 60%)", filter: "blur(28px)" }}
      />
    </div>
  );
}

function Wallpaper({ id, fog }: { id: WallpaperId; fog: boolean }) {
  const uid = useId().replace(/:/g, "");
  const ref = (name: string) => `${name}-${uid}`;
  const layers = useMemo(
    () => ({
      far: forestLayer(7, 90, 760, 120, 260),
      mid: forestLayer(21, 60, 860, 200, 380),
      near: forestLayer(99, 26, 1000, 380, 640),
      ridgeFar: ridge(3, 640, 120),
      ridgeNear: ridge(11, 800, 90),
      dead: deadTree(1380, 860, 520, 5),
    }),
    [],
  );

  if (id === "void") {
    return (
      <div className="absolute inset-0 bg-abyss">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 120%, rgb(var(--accent) / .22), transparent 60%)" }} />
        <svg viewBox="0 0 200 200" className="absolute left-1/2 top-1/2 aspect-square h-[46%] -translate-x-1/2 -translate-y-1/2 opacity-[.13]">
          <g fill="none" stroke="#d9d1c1" strokeWidth="0.8">
            <circle cx="100" cy="100" r="92" />
            <circle cx="100" cy="100" r="80" />
            <path d="M100 20 L169 140 L31 140 Z" />
            <path d="M100 180 L31 60 L169 60 Z" />
            <path d="M100 8 V192 M8 100 H192" strokeWidth="0.4" />
          </g>
        </svg>
        <Fog animate={fog} opacity={0.5} />
      </div>
    );
  }

  const palette = {
    forest: { sky: ["#0a0a0b", "#17181a", "#26282a"], far: "#2c2e30", mid: "#151617", near: "#050505", moon: { x: 1440, y: 260, r: 70 } },
    moon: { sky: ["#050505", "#0e0d0f", "#1b1a1c"], far: "#18181a", mid: "#0c0c0d", near: "#040404", moon: { x: 960, y: 380, r: 190 } },
    fog: { sky: ["#3a3a3a", "#2a2a2b", "#1a1a1a"], far: "#4a4a4a", mid: "#2a2a2a", near: "#0b0b0b", moon: null },
  }[id];

  return (
    <div className="absolute inset-0 overflow-hidden bg-abyss">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={ref("sky")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.sky[0]} />
            <stop offset=".6" stopColor={palette.sky[1]} />
            <stop offset="1" stopColor={palette.sky[2]} />
          </linearGradient>
          <radialGradient id={ref("moonGlow")}>
            <stop offset="0" stopColor="#e9e3d6" stopOpacity=".35" />
            <stop offset="1" stopColor="#e9e3d6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ref("moonFace")} cx=".4" cy=".35">
            <stop offset="0" stopColor="#f1ece0" />
            <stop offset="1" stopColor="#a9a397" />
          </radialGradient>
          <linearGradient id={ref("mist")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a8580" stopOpacity="0" />
            <stop offset="1" stopColor="#8a8580" stopOpacity=".22" />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill={`url(#${ref("sky")})`} />
        {palette.moon && (
          <g>
            <circle cx={palette.moon.x} cy={palette.moon.y} r={palette.moon.r * 3.2} fill={`url(#${ref("moonGlow")})`} />
            <circle cx={palette.moon.x} cy={palette.moon.y} r={palette.moon.r} fill={`url(#${ref("moonFace")})`} opacity=".92" />
            <circle cx={palette.moon.x - palette.moon.r * 0.3} cy={palette.moon.y - palette.moon.r * 0.2} r={palette.moon.r * 0.16} fill="#8f897e" opacity=".35" />
            <circle cx={palette.moon.x + palette.moon.r * 0.28} cy={palette.moon.y + palette.moon.r * 0.3} r={palette.moon.r * 0.22} fill="#8f897e" opacity=".25" />
          </g>
        )}
        {id === "moon" ? (
          <>
            <path d={layers.ridgeFar} fill={palette.far} />
            <rect y="560" width="1920" height="520" fill={`url(#${ref("mist")})`} />
            <path d={layers.ridgeNear} fill={palette.mid} />
            <path d={layers.dead} stroke={palette.near} strokeWidth="5" strokeLinecap="round" fill="none" />
            <rect y="850" width="1920" height="230" fill={palette.near} />
          </>
        ) : (
          <>
            <path d={layers.far} fill={palette.far} />
            <rect y="560" width="1920" height="520" fill={`url(#${ref("mist")})`} />
            <path d={layers.mid} fill={palette.mid} />
            <rect y="700" width="1920" height="380" fill={`url(#${ref("mist")})`} opacity=".6" />
            <path d={layers.near} fill={palette.near} />
          </>
        )}
      </svg>
      <Fog animate={fog} opacity={id === "fog" ? 1.4 : 1} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,.65))" }} />
    </div>
  );
}

export default memo(Wallpaper);

export const wallpapers: { id: WallpaperId; label: string }[] = [
  { id: "forest", label: "Pine Forest" },
  { id: "moon", label: "Pale Moon" },
  { id: "fog", label: "Ashen Fog" },
  { id: "void", label: "The Void" },
];
