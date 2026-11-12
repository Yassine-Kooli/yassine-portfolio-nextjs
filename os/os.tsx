"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { accents, BOOTED_KEY, useSystem } from "@/store/system";
import BootScreen from "@/os/boot-screen";
import LockScreen from "@/os/lock-screen";
import Desktop from "@/os/desktop";
import MobileShell from "@/os/mobile-shell";
import PowerOff from "@/os/power-off";

const noopSubscribe = () => () => {};
// false during SSR and hydration, true once the client has mounted
const useMounted = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export default function OS() {
  const mounted = useMounted();
  const [mobile, setMobile] = useState(false);
  const phase = useSystem((s) => s.phase);
  const accent = useSystem((s) => s.accent);

  useEffect(() => {
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
    <main className="relative h-full w-full select-none overflow-hidden bg-abyss">
      <AnimatePresence mode="wait">
        {phase === "boot" && <BootScreen key="boot" />}
        {phase === "login" && <LockScreen key="login" />}
        {phase === "desktop" && (mobile ? <MobileShell key="mobile" /> : <Desktop key="desktop" />)}
        {phase === "off" && <PowerOff key="off" />}
      </AnimatePresence>
    </main>
  );
}
