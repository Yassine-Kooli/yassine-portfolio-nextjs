"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import { BOOTED_KEY, useSystem } from "@/store/system";
import { useClock } from "@/os/use-clock";
import Wallpaper from "@/os/wallpaper";

export default function LockScreen() {
  const now = useClock();
  const wallpaper = useSystem((s) => s.wallpaper);
  const fog = useSystem((s) => s.fog);

  const enter = () => {
    try {
      sessionStorage.setItem(BOOTED_KEY, "1");
    } catch {}
    const sys = useSystem.getState();
    sys.setPhase("desktop");
    setTimeout(() => sys.notify("Welcome to YassineOS", "Open the Terminal and type `help` — or just poke around."), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 cursor-pointer"
      onClick={enter}
      onKeyDown={enter}
      tabIndex={0}
      autoFocus
    >
      <div className="absolute inset-0 scale-110 blur-md">
        <Wallpaper id={wallpaper} fog={fog} />
      </div>
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative flex h-full flex-col items-center justify-between py-16 text-center">
        <div>
          <div className="font-display text-7xl font-semibold tracking-wider text-parchment sm:text-8xl">
            {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </div>
          <div className="mt-2 font-display text-lg tracking-[0.25em] text-ash-300">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-accent/70 shadow-[0_0_40px_rgb(var(--accent)/.35)]">
            <Image src={profile.avatar} alt={profile.name} fill sizes="112px" className="object-cover grayscale" priority />
          </div>
          <div className="font-goth text-4xl text-parchment">{profile.name}</div>
          <div className="text-sm text-ash-300">{profile.role}</div>
          <motion.div
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="mt-6 font-display text-xs tracking-[0.35em] text-ash-300"
          >
            CLICK TO DESCEND
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
