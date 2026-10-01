"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { projectsData } from "@/lib/data";
import { useSystem } from "@/store/system";

const LINES: [string, string][] = [
  ["", "YassineOS 1.0 (Ghost) — kernel 6.6.6-doom x86_64"],
  ["OK", "Started Kernel Logging Service."],
  ["OK", "Mounted /dev/sorrow."],
  ["OK", "Reached target Eternal Darkness."],
  ["OK", "Started PHP-FPM 8.3 (the Laravel engine)."],
  ["OK", `Loaded ${projectsData.length} projects from /home/yassine/projects.`],
  ["OK", "Tuned guitars to D standard."],
  ["OK", "Started Fog Generator Daemon."],
  ["WARN", "Light mode not found. Continuing in darkness."],
  ["OK", "Started Window Manager."],
  ["OK", "Reached target Graphical Interface."],
];

export default function BootScreen() {
  const [count, setCount] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const setPhase = useSystem((s) => s.setPhase);

  useEffect(() => {
    if (count < LINES.length) {
      const t = setTimeout(() => setCount((c) => c + 1), 90 + Math.random() * 160);
      return () => clearTimeout(t);
    }
    const a = setTimeout(() => setShowLogo(true), 300);
    const b = setTimeout(() => setPhase("login"), 2600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [count, setPhase]);

  useEffect(() => {
    const skip = () => setPhase("login");
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [setPhase]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={() => setPhase("login")}
      className="absolute inset-0 cursor-pointer bg-abyss p-6 font-mono text-[13px] leading-6 text-ash-300 sm:p-10"
    >
      {!showLogo ? (
        <div>
          {LINES.slice(0, count).map(([status, text], i) => (
            <div key={i} className="whitespace-pre-wrap">
              {status && (
                <>
                  [<span className={status === "OK" ? "text-[#6f9a5a]" : "text-[#c9a227]"}>{status === "OK" ? "  OK  " : " WARN "}</span>]{" "}
                </>
              )}
              {text}
            </div>
          ))}
          <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-ash-300" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4 }}
          className="flex h-full flex-col items-center justify-center gap-6"
        >
          <h1 className="animate-flicker font-goth text-6xl text-parchment drop-shadow-[0_0_24px_rgba(160,24,24,.45)] sm:text-8xl">YassineOS</h1>
          <div className="h-[2px] w-48 overflow-hidden bg-ash-800">
            <motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} />
          </div>
        </motion.div>
      )}
      <div className="absolute bottom-4 right-6 text-[11px] text-ash-500">click or press any key to skip</div>
    </motion.div>
  );
}
