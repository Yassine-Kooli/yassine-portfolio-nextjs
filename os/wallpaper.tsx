"use client";

import type { WallpaperId } from "@/store/system";

// Pure CSS wallpapers: no SVG generation, no animation, so the desktop stays light.
const BACKGROUNDS: Record<WallpaperId, string> = {
  graphite: "radial-gradient(1200px 700px at 15% -10%, rgba(99,102,241,.22), transparent 60%), linear-gradient(160deg, #15181e 0%, #0b0d10 100%)",
  midnight: "radial-gradient(900px 600px at 85% 110%, rgba(56,189,248,.16), transparent 60%), linear-gradient(180deg, #0c1322 0%, #070910 100%)",
  slate: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px) 0 0 / 48px 48px, #0e1014",
};

export const wallpapers: { id: WallpaperId; label: string }[] = [
  { id: "graphite", label: "Graphite" },
  { id: "midnight", label: "Midnight" },
  { id: "slate", label: "Slate grid" },
];

export default function Wallpaper({ id }: { id: WallpaperId }) {
  return <div aria-hidden className="absolute inset-0 bg-abyss" style={{ backgroundImage: BACKGROUNDS[id] }} />;
}
