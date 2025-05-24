"use client";

import React from "react";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/active-section-context";
import ThemeSwitch from "./theme-switch";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Header() {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  const { t } = useTranslation();

  return (
    <header className="z-[999] relative">
      <motion.div
        className="fixed top-0 left-1/2 h-[4.5rem] w-full rounded-none border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[0.03] backdrop-blur-[0.5rem] sm:top-6 sm:h-[3.25rem] sm:w-[48rem] sm:rounded-full dark:bg-gray-950 dark:border-black/40 dark:bg-opacity-75"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>

      {/* Mobile menu button */}
      <div className="fixed top-3 right-4 z-[1000] sm:hidden">
        <button
          onClick={() => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
              mobileMenu.classList.toggle('hidden');
            }
          }}
          className="p-2 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className="fixed inset-0 z-[999] hidden bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm pt-20 pb-6 px-6 sm:hidden">
        <button
          onClick={() => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
              mobileMenu.classList.add('hidden');
            }
          }}
          className="absolute top-3 right-4 p-2 rounded-md"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <ul className="flex flex-col items-center gap-4 text-lg font-medium text-gray-800 dark:text-gray-200">
          {links.map((link) => (
            <li key={link.hash} className="w-full">
              <Link
                className={clsx(
                  "flex w-full items-center justify-center py-3 px-4 rounded-md transition",
                  {
                    "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400":
                      activeSection === link.name,
                    "hover:bg-gray-100 dark:hover:bg-gray-800":
                      activeSection !== link.name
                  }
                )}
                href={link.hash}
                onClick={() => {
                  setActiveSection(link.name);
                  setTimeOfLastClick(Date.now());
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                  }
                }}
              >
                {t(`navigation.${link.name.toLowerCase()}`)}
              </Link>
            </li>
          ))}

          <li className="w-full pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>
          </li>
        </ul>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden sm:flex fixed top-[0.15rem] left-1/2 h-12 -translate-x-1/2 py-2 sm:top-[1.7rem] sm:h-[initial] sm:py-0">
        <ul className="flex w-full max-w-[44rem] flex-wrap items-center justify-between px-4 gap-y-1 text-[0.9rem] font-medium text-gray-500 sm:flex-nowrap sm:gap-3">
          <div className="flex items-center justify-center flex-wrap sm:flex-nowrap">
            {links.map((link) => (
              <motion.li
                className="h-3/4 flex items-center justify-center relative"
                key={link.hash}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Link
                  className={clsx(
                    "flex w-full items-center justify-center px-2 py-3 hover:text-gray-950 transition dark:text-gray-500 dark:hover:text-gray-300 sm:px-2",
                    {
                      "text-primary-600 dark:text-primary-400":
                        activeSection === link.name,
                    }
                  )}
                  href={link.hash}
                  onClick={() => {
                    setActiveSection(link.name);
                    setTimeOfLastClick(Date.now());
                  }}
                >
                  {t(`navigation.${link.name.toLowerCase()}`)}

                  {link.name === activeSection && (
                    <motion.span
                      className="bg-gray-100 rounded-full absolute inset-0 -z-10 dark:bg-gray-800"
                      layoutId="activeSection"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    ></motion.span>
                  )}
                </Link>
              </motion.li>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeSwitch />
          </div>
        </ul>
      </nav>
    </header>
  );
}
