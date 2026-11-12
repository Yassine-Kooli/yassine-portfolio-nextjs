"use client";

import dynamic from "next/dynamic";
import { accents, useSystem, type WallpaperId } from "@/store/system";

// Three.js is loaded only when a 3D wallpaper is shown on screen (never in previews).
const BarsScene = dynamic(() => import("@/components/three/bars-scene"), { ssr: false, loading: () => null });

// CSS fallbacks: used for previews, and as the base under the 3D scene.
const BACKGROUNDS: Record<WallpaperId, string> = {
  bars: "radial-gradient(900px 500px at 50% 0%, rgba(99,102,241,.28), transparent 65%), linear-gradient(180deg, #0f1218 0%, #07080b 100%)",
  graphite: "radial-gradient(1200px 700px at 15% -10%, rgba(99,102,241,.22), transparent 60%), linear-gradient(160deg, #15181e 0%, #0b0d10 100%)",
  midnight: "radial-gradient(900px 600px at 85% 110%, rgba(56,189,248,.16), transparent 60%), linear-gradient(180deg, #0c1322 0%, #070910 100%)",
  slate: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px) 0 0 / 48px 48px, #0e1014",
};

export const wallpapers: { id: WallpaperId; label: string; three?: boolean }[] = [
  { id: "bars", label: "3D data bars", three: true },
  { id: "graphite", label: "Graphite" },
  { id: "midnight", label: "Midnight" },
  { id: "slate", label: "Slate grid" },
];

export default function Wallpaper({ id, preview = false }: { id: WallpaperId; preview?: boolean }) {
  const accent = useSystem((s) => s.accent);
  const is3d = wallpapers.find((w) => w.id === id)?.three;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-abyss" style={{ backgroundImage: BACKGROUNDS[id] }}>
      {is3d && !preview && <BarsScene accent={accents[accent].rgb} />}
    </div>
  );
}
