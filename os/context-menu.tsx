"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { wallpapers } from "@/os/wallpaper";
import { useSystem } from "@/store/system";
import { useWindows } from "@/store/windows";
import { HOME } from "@/lib/fs";

export default function ContextMenu({ x, y, onClose }: { x: number; y: number; onClose: () => void }) {
  useEffect(() => {
    const close = () => onClose();
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", close);
    };
  }, [onClose]);

  const { open } = useWindows.getState();
  const nextWallpaper = () => {
    const { wallpaper, set } = useSystem.getState();
    const i = wallpapers.findIndex((w) => w.id === wallpaper);
    set({ wallpaper: wallpapers[(i + 1) % wallpapers.length].id });
  };

  const entries: ({ label: string; run: () => void } | null)[] = [
    { label: "Open Terminal", run: () => open("terminal") },
    { label: "Open Home Folder", run: () => open("files", { props: { path: HOME } }) },
    null,
    { label: "Next Wallpaper", run: nextWallpaper },
    { label: "Settings", run: () => open("settings") },
    null,
    { label: "About YassineOS", run: () => open("settings", { props: { tab: "about" } }) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.08 }}
      style={{ left: x, top: y }}
      className="glass absolute z-[4800] w-56 rounded-xl border border-white/10 p-1.5 text-sm shadow-window"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {entries.map((e, i) =>
        e ? (
          <button
            key={e.label}
            onClick={() => {
              e.run();
              onClose();
            }}
            className="block w-full rounded-md px-3 py-1.5 text-left text-bone transition hover:bg-accent/40"
          >
            {e.label}
          </button>
        ) : (
          <div key={i} className="my-1 h-px bg-white/10" />
        ),
      )}
    </motion.div>
  );
}
