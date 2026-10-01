"use client";

import { motion } from "framer-motion";
import { LuPower } from "react-icons/lu";
import { useSystem } from "@/store/system";

export default function PowerOff() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black"
    >
      <p className="font-display text-sm tracking-[0.3em] text-ash-500">THE LIGHT HAS GONE OUT</p>
      <button
        onClick={() => useSystem.getState().setPhase("boot")}
        className="grid h-16 w-16 place-items-center rounded-full border border-ash-700 text-ash-400 transition hover:border-accent hover:text-accent"
        aria-label="Power on"
      >
        <LuPower size={26} />
      </button>
    </motion.div>
  );
}
