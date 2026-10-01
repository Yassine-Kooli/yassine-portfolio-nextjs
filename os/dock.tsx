"use client";

import clsx from "clsx";
import { LuLayoutGrid } from "react-icons/lu";
import { apps, launchableApps, type AppId } from "@/lib/apps";
import { useSystem } from "@/store/system";
import { useWindows } from "@/store/windows";
import AppIcon from "@/os/app-icon";

export function activateApp(appId: AppId) {
  const { windows, activeId, open, focus, minimize } = useWindows.getState();
  const mine = windows.filter((w) => w.appId === appId).sort((a, b) => b.z - a.z);
  if (!mine.length) return open(appId);
  const top = mine[0];
  if (top.id === activeId && !top.minimized) return minimize(top.id);
  focus(top.id);
}

export default function Dock() {
  const windows = useWindows((s) => s.windows);
  const activeApp = useWindows((s) => s.windows.find((w) => w.id === s.activeId)?.appId);
  const running = new Set(windows.map((w) => w.appId));
  // Non-launchable apps (text editor, pdf) appear only while open
  const items = [...launchableApps.map((a) => a.id), ...Object.values(apps).filter((a) => !a.launchable && running.has(a.id)).map((a) => a.id)];

  return (
    <nav className="absolute bottom-0 left-0 top-8 z-[4000] flex w-[72px] flex-col items-center gap-2 border-r border-white/5 bg-black/70 py-3 backdrop-blur-md">
      {items.map((id) => {
        const count = windows.filter((w) => w.appId === id).length;
        return (
          <button
            key={id}
            onClick={() => {
              useSystem.getState().set({ launcherOpen: false });
              activateApp(id);
            }}
            className={clsx("group relative rounded-xl p-1 transition hover:bg-white/10", activeApp === id && "bg-white/10")}
            aria-label={apps[id].title}
          >
            <AppIcon id={id} size={44} />
            {count > 0 && (
              <span className="absolute left-0 top-1/2 flex -translate-y-1/2 flex-col gap-1">
                {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgb(var(--accent))]" />
                ))}
              </span>
            )}
            <span className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black/90 px-2.5 py-1 font-display text-xs tracking-wider text-bone opacity-0 transition group-hover:opacity-100">
              {apps[id].title}
            </span>
          </button>
        );
      })}
      <div className="flex-1" />
      <button
        onClick={() => useSystem.getState().set({ launcherOpen: !useSystem.getState().launcherOpen })}
        className="grid h-12 w-12 place-items-center rounded-xl text-ash-300 transition hover:bg-white/10 hover:text-bone"
        aria-label="Show applications"
      >
        <LuLayoutGrid size={22} />
      </button>
    </nav>
  );
}
