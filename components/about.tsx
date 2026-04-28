"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { useTranslation } from "@/lib/hooks";
import { FaCode, FaDatabase, FaLightbulb, FaUsers } from "react-icons/fa";

const highlights = [
  { icon: FaCode, label: "Clean Code", desc: "SOLID principles & best practices" },
  { icon: FaDatabase, label: "Database Design", desc: "MySQL, PostgreSQL, Redis" },
  { icon: FaUsers, label: "Agile Teams", desc: "Scrum & collaborative workflows" },
  { icon: FaLightbulb, label: "Problem Solving", desc: "Performance & scalability focus" },
];

export default function About() {
  const { ref } = useSectionInView("About");
  const { t } = useTranslation();

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[50rem] w-full scroll-mt-28 sm:mb-40 px-4"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      id="about"
    >
      <SectionHeading translationKey="about.title" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {highlights.map((h, i) => {
          const Icon = h.icon;
          return (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-xl p-4 hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className="text-white text-sm" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800 dark:text-white/90">{h.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{h.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 rounded-2xl p-6 text-left space-y-3">
        <p className="leading-relaxed text-gray-700 dark:text-white/80">
          {t('about.description')}
        </p>
        <p className="leading-relaxed text-gray-700 dark:text-white/80">
          {t('about.background')}
        </p>
        <p className="leading-relaxed text-gray-700 dark:text-white/80">
          {t('about.approach')}
        </p>
      </div>
    </motion.section>
  );
}
