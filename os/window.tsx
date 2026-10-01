"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { Rnd } from "react-rnd";
import { LuCopy, LuMinus, LuSquare, LuX } from "react-icons/lu";
import { apps } from "@/lib/apps";
import { useWindows, type WindowState } from "@/store/windows";
import AppView from "@/os/app-view";

export default function Window({ win }: { win: WindowState }) {
  const active = useWindows((s) => s.activeId === win.id);
  const { focus, close, minimize, toggleMaximize, setBounds } = useWindows.getState();
  const meta = apps[win.appId];
  const Icon = meta.icon;

  return (
    <Rnd
      size={win.maximized ? { width: "100%", height: "100%" } : { width: win.w, height: win.h }}
      position={win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y }}
      minWidth={meta.minSize?.w ?? 340}
      minHeight={meta.minSize?.h ?? 240}
      bounds="parent"
      dragHandleClassName="win-drag"
      cancel=".win-nodrag"
      disableDragging={win.maximized}
      enableResizing={!win.maximized}
      onMouseDown={() => focus(win.id)}
      onDragStop={(_, d) => setBounds(win.id, { x: d.x, y: Math.max(0, d.y) })}
      onResizeStop={(_, __, ref, ___, pos) => setBounds(win.id, { w: ref.offsetWidth, h: ref.offsetHeight, x: pos.x, y: pos.y })}
      style={{ zIndex: win.z, display: win.minimized ? "none" : undefined }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12 } }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={clsx(
          "flex h-full w-full flex-col overflow-hidden border bg-crypt shadow-window",
          win.maximized ? "rounded-none" : "rounded-xl",
          active ? "border-ash-600/80" : "border-ash-700/60",
        )}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div
          className={clsx(
            "win-drag flex h-10 shrink-0 cursor-default items-center border-b border-black/60 bg-gradient-to-b from-ash-800 to-ash-900",
            !active && "opacity-80",
          )}
          onDoubleClick={() => toggleMaximize(win.id)}
        >
          <div className="flex w-24 items-center pl-3 text-ash-400">
            <Icon size={15} />
          </div>
          <div className={clsx("flex-1 truncate text-center font-display text-[13px] tracking-wider", active ? "text-bone" : "text-ash-400")}>
            {win.title}
          </div>
          <div className="win-nodrag flex w-24 items-center justify-end gap-1.5 pr-2.5">
            <button aria-label="Minimize" onClick={() => minimize(win.id)} className="grid h-6 w-6 place-items-center rounded-full bg-ash-700/70 text-ash-300 transition hover:bg-ash-600 hover:text-bone">
              <LuMinus size={12} />
            </button>
            <button aria-label="Maximize" onClick={() => toggleMaximize(win.id)} className="grid h-6 w-6 place-items-center rounded-full bg-ash-700/70 text-ash-300 transition hover:bg-ash-600 hover:text-bone">
              {win.maximized ? <LuCopy size={11} /> : <LuSquare size={10} />}
            </button>
            <button aria-label="Close" onClick={() => close(win.id)} className="grid h-6 w-6 place-items-center rounded-full bg-ash-700/70 text-ash-300 transition hover:bg-accent hover:text-parchment">
              <LuX size={13} />
            </button>
          </div>
        </div>
        <div className="win-nodrag relative min-h-0 flex-1 select-text overflow-hidden">
          <AppView appId={win.appId} windowId={win.id} props={win.props} active={active} />
        </div>
      </motion.div>
    </Rnd>
  );
}
