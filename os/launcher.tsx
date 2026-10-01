"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuSearch } from "react-icons/lu";
import { launchableApps } from "@/lib/apps";
import { useSystem } from "@/store/system";
import { useWindows } from "@/store/windows";
import AppIcon from "@/os/app-icon";

export default function Launcher() {
  const open = useSystem((s) => s.launcherOpen);
  const [q, setQ] = useState("");
  const close = () => useSystem.getState().set({ launcherOpen: false });

  useEffect(() => {
    if (!open) return setQ("");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const results = launchableApps.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || a.id.includes(q.toLowerCase()));
  const launch = (id: (typeof launchableApps)[number]["id"]) => {
    useWindows.getState().open(id);
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-0 left-[72px] right-0 top-8 z-[4500] flex flex-col items-center bg-black/70 px-8 pt-14 backdrop-blur-xl"
          onClick={close}
        >
          <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-ash-900/90 px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
            <LuSearch className="text-ash-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && results[0] && launch(results[0].id)}
              placeholder="Type to search…"
              className="w-full bg-transparent text-bone outline-none placeholder:text-ash-500"
            />
          </div>
          <motion.div
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            className="mt-14 grid max-w-3xl grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-5"
          >
            {results.map((a) => (
              <button
                key={a.id}
                onClick={(e) => {
                  e.stopPropagation();
                  launch(a.id);
                }}
                className="flex w-28 flex-col items-center gap-3 rounded-2xl p-4 transition hover:bg-white/10"
              >
                <AppIcon id={a.id} size={68} />
                <span className="font-display text-sm tracking-wide text-bone">{a.title}</span>
              </button>
            ))}
            {!results.length && <p className="col-span-full text-center text-ash-400">Nothing answers from the dark.</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
