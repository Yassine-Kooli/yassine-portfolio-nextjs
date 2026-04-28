"use client";

import { useRef } from "react";
import { projectsData } from "@/lib/data";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

type ProjectProps = (typeof projectsData)[number] & { index: number };

const typeColors: Record<string, string> = {
  "SaaS": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  "E-Commerce": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  "Admin Panel": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Internal Tool": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  "EdTech": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export default function Project({ title, type, description, features, tags, link, index }: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["0 1", "1.1 1"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  const num = String(index + 1).padStart(2, "0");
  const colorClass = typeColors[type] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="mb-0">
      <div className="group relative py-8 border-b border-black/8 dark:border-white/8 hover:border-primary-300/50 dark:hover:border-primary-700/50 transition-colors duration-300">

        {/* Hover background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/60 to-primary-50/0 dark:from-transparent dark:via-white/[0.02] dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-lg pointer-events-none" />

        <div className="relative grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-8 gap-y-4">

          {/* Number */}
          <div className="hidden sm:block">
            <span className="text-5xl font-black text-gray-300 dark:text-white/[0.15] leading-none select-none group-hover:text-primary-300 dark:group-hover:text-primary-700/60 transition-colors duration-300">
              {num}
            </span>
          </div>

          {/* Content */}
          <div>
            {/* Header row */}
            <div className="flex flex-wrap items-start gap-3 mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-medium sm:hidden text-gray-400 dark:text-gray-600">{num} /</span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {title}
                </h3>
              </div>
              <span className={`text-[0.65rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex-shrink-0 ${colorClass}`}>
                {type}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed mb-4 max-w-[52rem]">
              {description}
            </p>

            {/* Features */}
            <ul className="space-y-1.5 mb-5">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-white/70">
                  <span className="mt-[3px] w-4 h-4 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Footer row: tags + link */}
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <ul className="flex flex-wrap gap-1.5">
                {tags.map((tag, i) => (
                  <li
                    key={i}
                    className="text-[0.65rem] px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 font-medium border border-black/5 dark:border-white/15"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {link && (
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-white/40 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group/link flex-shrink-0"
                >
                  <FaGithub className="text-sm" />
                  View code
                  <HiArrowRight className="text-sm -rotate-45 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
