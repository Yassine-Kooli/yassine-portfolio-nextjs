"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { LuLock, LuMusic, LuPower, LuRotateCcw, LuWifi } from "react-icons/lu";
import { apps } from "@/lib/apps";
import { playlist } from "@/lib/playlist";
import { useMusic } from "@/store/music";
import { useSystem } from "@/store/system";
import { useWindows } from "@/store/windows";
import { useClock } from "@/os/use-clock";

export default function TopBar() {
  const now = useClock();
  const activeApp = useWindows((s) => s.windows.find((w) => w.id === s.activeId)?.appId);
  const launcherOpen = useSystem((s) => s.launcherOpen);
  const index = useMusic((s) => s.index);
  const playing = useMusic((s) => s.playing);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const onDown = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menu]);

  const power = (action: "lock" | "restart" | "off") => {
    setMenu(false);
    const sys = useSystem.getState();
    useMusic.getState().pause();
    if (action === "lock") return sys.setPhase("login");
    useWindows.getState().closeAll();
    try {
      sessionStorage.removeItem("yassineos-booted");
    } catch {}
    sys.setPhase(action === "restart" ? "boot" : "off");
  };

  const track = playlist[index];

  return (
    <header className="absolute inset-x-0 top-0 z-[5000] flex h-8 items-center justify-between bg-black/90 px-2 text-[13px] text-bone">
      <div className="flex items-center gap-1">
        <button
          onClick={() => useSystem.getState().set({ launcherOpen: !launcherOpen })}
          className={clsx("rounded-full px-3 py-0.5 font-display tracking-wider transition hover:bg-white/10", launcherOpen && "bg-white/15")}
        >
          Activities
        </button>
        {activeApp && <span className="hidden px-2 font-bold text-ash-300 sm:inline">{apps[activeApp].title}</span>}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 font-bold tabular-nums">
        {now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        <span className="ml-2">{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
      </div>

      <div ref={menuRef} className="relative flex items-center gap-1">
        {track && (
          <button
            onClick={() => useWindows.getState().open("music")}
            className="hidden max-w-[220px] items-center gap-2 rounded-full px-3 py-0.5 text-ash-300 transition hover:bg-white/10 md:flex"
          >
            <LuMusic size={13} className={clsx(playing && "animate-pulse text-accent")} />
            <span className="truncate">{playing ? `${track.artist} — ${track.title}` : "Paused"}</span>
          </button>
        )}
        <button onClick={() => setMenu((m) => !m)} className={clsx("flex items-center gap-2.5 rounded-full px-3 py-1 transition hover:bg-white/10", menu && "bg-white/15")}>
          <LuWifi size={14} />
          <LuPower size={14} />
        </button>
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="glass absolute right-0 top-9 w-56 rounded-2xl border border-white/10 p-3 shadow-window"
            >
              {[
                { icon: LuLock, label: "Lock", action: "lock" as const },
                { icon: LuRotateCcw, label: "Restart", action: "restart" as const },
                { icon: LuPower, label: "Power Off", action: "off" as const },
              ].map(({ icon: Icon, label, action }) => (
                <button key={action} onClick={() => power(action)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/10">
                  <Icon size={15} /> {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
