"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { accents, BOOTED_KEY, useSystem } from "@/store/system";
import BootScreen from "@/os/boot-screen";
import LockScreen from "@/os/lock-screen";
import Desktop from "@/os/desktop";
import MobileShell from "@/os/mobile-shell";
import PowerOff from "@/os/power-off";

export default function OS() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const phase = useSystem((s) => s.phase);
  const accent = useSystem((s) => s.accent);
  const grain = useSystem((s) => s.grain);

  useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(BOOTED_KEY)) useSystem.getState().setPhase("desktop");
    } catch {}
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accents[accent].rgb);
  }, [accent]);

  if (!mounted) return <div className="h-full w-full bg-abyss" />;

  return (
    <main className={clsx("relative h-full w-full select-none overflow-hidden bg-abyss", grain && "grain")}>
      <AnimatePresence mode="wait">
        {phase === "boot" && <BootScreen key="boot" />}
        {phase === "login" && <LockScreen key="login" />}
        {phase === "desktop" && (mobile ? <MobileShell key="mobile" /> : <Desktop key="desktop" />)}
        {phase === "off" && <PowerOff key="off" />}
      </AnimatePresence>
    </main>
  );
}
