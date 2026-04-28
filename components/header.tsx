"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import ThemeSwitch from "./theme-switch";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (name: string) => {
    setActiveSection(name as any);
    setTimeOfLastClick(Date.now());
    setMobileOpen(false);
  };

  return (
    <header className="z-[999] relative">
      {/* Desktop pill nav */}
      <motion.div
        className="fixed top-0 left-1/2 h-[4.5rem] w-full border border-white/40 bg-white/80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] sm:w-[46rem] sm:rounded-full dark:bg-gray-950/80 dark:border-black/40"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      />

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="fixed top-3.5 right-4 z-[1001] sm:hidden p-2 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-black/10 dark:border-white/10 text-gray-700 dark:text-gray-300 shadow-sm"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
      </button>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[1000] sm:hidden bg-white/96 dark:bg-gray-950/96 backdrop-blur-md pt-20 pb-8 px-6 flex flex-col"
          >
            <ul className="flex flex-col gap-1 flex-1">
              {links.map((link) => (
                <li key={link.hash}>
                  <Link
                    className={clsx(
                      "flex w-full items-center py-3.5 px-4 rounded-xl text-base font-medium transition-all",
                      activeSection === link.name
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                    href={link.hash}
                    onClick={() => handleNav(link.name)}
                  >
                    {t(`navigation.${link.name.toLowerCase()}`)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop nav */}
      <nav className="hidden sm:flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-full max-w-[44rem] flex-nowrap items-center justify-between px-4 gap-y-1 text-[0.9rem] font-medium text-gray-500">
          <div className="flex items-center">
            {links.map((link) => (
              <motion.li
                className="h-3/4 flex items-center justify-center relative"
                key={link.hash}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Link
                  className={clsx(
                    "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-gray-500 dark:hover:text-gray-300",
                    { "text-primary-600 dark:text-primary-400": activeSection === link.name }
                  )}
                  href={link.hash}
                  onClick={() => handleNav(link.name)}
                >
                  {t(`navigation.${link.name.toLowerCase()}`)}
                  {link.name === activeSection && (
                    <motion.span
                      className="bg-gray-100 rounded-full absolute inset-0 -z-10 dark:bg-gray-800"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-2">
            <LanguageSwitcher />
            <ThemeSwitch />
          </div>
        </ul>
      </nav>
    </header>
  );
}
