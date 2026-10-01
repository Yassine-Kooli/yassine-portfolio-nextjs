"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystem } from "@/store/system";
import { useWindows, DOCK_W, TOPBAR_H } from "@/store/windows";
import Wallpaper from "@/os/wallpaper";
import TopBar from "@/os/top-bar";
import Dock from "@/os/dock";
import Launcher from "@/os/launcher";
import Notifications from "@/os/notifications";
import DesktopIcons from "@/os/desktop-icons";
import ContextMenu from "@/os/context-menu";
import Window from "@/os/window";

export default function Desktop() {
  const windows = useWindows((s) => s.windows);
  const wallpaper = useSystem((s) => s.wallpaper);
  const fog = useSystem((s) => s.fog);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
      <Wallpaper id={wallpaper} fog={fog} />
      <TopBar />
      <Dock />
      <div
        className="absolute bottom-0 right-0"
        style={{ top: TOPBAR_H, left: DOCK_W }}
        onContextMenu={(e) => {
          e.preventDefault();
          const rect = e.currentTarget.getBoundingClientRect();
          setMenu({ x: Math.min(e.clientX - rect.left, rect.width - 230), y: Math.min(e.clientY - rect.top, rect.height - 240) });
        }}
      >
        <DesktopIcons />
        <AnimatePresence>
          {windows.map((w) => (
            <Window key={w.id} win={w} />
          ))}
        </AnimatePresence>
        {menu && <ContextMenu x={menu.x} y={menu.y} onClose={closeMenu} />}
      </div>
      <Launcher />
      <Notifications />
    </motion.div>
  );
}
