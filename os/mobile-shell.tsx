"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LuBatteryFull, LuChevronLeft, LuWifi } from "react-icons/lu";
import { apps, launchableApps } from "@/lib/apps";
import { profile } from "@/lib/data";
import { useSystem } from "@/store/system";
import { useWindows } from "@/store/windows";
import { useClock } from "@/os/use-clock";
import Wallpaper from "@/os/wallpaper";
import AppIcon from "@/os/app-icon";
import AppView from "@/os/app-view";
import Notifications from "@/os/notifications";

// Phone layout: a home screen grid; the top-most "window" is shown full screen.
export default function MobileShell() {
  const now = useClock();
  const wallpaper = useSystem((s) => s.wallpaper);
  const fog = useSystem((s) => s.fog);
  const top = useWindows((s) => [...s.windows].filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0]);
  const { open, close } = useWindows.getState();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col">
      <Wallpaper id={wallpaper} fog={fog} />
      <div className="relative z-20 flex h-7 shrink-0 items-center justify-between bg-black/60 px-4 text-xs font-bold text-bone">
        <span className="tabular-nums">{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
        <span className="flex items-center gap-2">
          <LuWifi size={13} /> <LuBatteryFull size={15} />
        </span>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-8 pt-10">
        <div className="mb-10 text-center">
          <div className="font-goth text-5xl text-parchment">{profile.name}</div>
          <div className="mt-1 font-display text-xs tracking-[0.3em] text-ash-300">{profile.role.toUpperCase()}</div>
        </div>
        <div className="grid grid-cols-4 gap-x-3 gap-y-6">
          {launchableApps.map((a) => (
            <button key={a.id} onClick={() => open(a.id)} className="flex flex-col items-center gap-1.5">
              <AppIcon id={a.id} size={58} className="rounded-2xl" />
              <span className="text-[11px] font-bold text-parchment [text-shadow:0_1px_3px_#000]">{a.title}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {top && (
          <motion.div
            key={top.id}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 top-7 z-30 flex flex-col bg-crypt"
          >
            <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black bg-ash-900 px-2">
              <button onClick={() => close(top.id)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-bone active:bg-white/10">
                <LuChevronLeft size={20} /> Home
              </button>
              <span className="flex-1 truncate pr-16 text-center font-display text-sm tracking-wider text-bone">{top.title || apps[top.appId].title}</span>
            </div>
            <div className="relative min-h-0 flex-1 select-text overflow-hidden">
              <AppView appId={top.appId} windowId={top.id} props={top.props} active />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Notifications />
    </motion.div>
  );
}
