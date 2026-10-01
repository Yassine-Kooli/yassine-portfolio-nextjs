"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LuBell } from "react-icons/lu";
import { useSystem } from "@/store/system";

export default function Notifications() {
  const items = useSystem((s) => s.notifications);
  return (
    <div className="pointer-events-none absolute left-1/2 top-10 z-[6000] flex w-[min(380px,92vw)] -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {items.map((n) => (
          <motion.button
            key={n.id}
            layout
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => useSystem.getState().dismiss(n.id)}
            className="glass pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 p-3.5 text-left shadow-window"
          >
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/25 text-accent">
              <LuBell size={15} />
            </span>
            <span>
              <span className="block font-display text-sm tracking-wide text-parchment">{n.title}</span>
              {n.body && <span className="mt-0.5 block text-[13px] leading-snug text-ash-300">{n.body}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
