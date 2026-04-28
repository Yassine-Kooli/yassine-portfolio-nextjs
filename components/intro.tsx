"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";
import { useTranslation } from "@/lib/hooks";

const ROLES = [
  "Laravel Developer",
  "Backend Engineer",
  "PHP Specialist",
  "SaaS Builder",
  "API Architect",
];

function TypewriterText({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = texts[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < current.length) {
        timeout = setTimeout(() => setCharIndex((c) => c + 1), 80);
        setDisplayText(current.slice(0, charIndex + 1));
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex((c) => c - 1), 40);
        setDisplayText(current.slice(0, charIndex - 1));
      } else {
        setIsDeleting(false);
        setCurrentIndex((i) => (i + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentIndex, texts]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
      {displayText}
      <span className="animate-pulse text-primary-500">|</span>
    </span>
  );
}

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const { t } = useTranslation();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[54rem] w-full text-center sm:mb-0 scroll-mt-[100rem]"
    >
      {/* Profile image */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, duration: 0.6 }}
            className="relative"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 blur-md opacity-40 scale-110 animate-pulse" />
            <div className="relative w-36 h-36 rounded-full p-[3px] bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-600">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-dark">
                <Image
                  src="/images/profile.png"
                  alt="Yassine portrait"
                  width={144}
                  height={144}
                  quality={95}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.span
            className="absolute -bottom-1 -right-1 text-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 125, delay: 0.4, duration: 0.7 }}
          >
            👋
          </motion.span>
        </div>
      </div>

      {/* Headline */}
      <motion.div
        className="px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-base text-gray-500 dark:text-gray-400 mb-2 tracking-widest uppercase text-xs font-medium">
          Hello, I&apos;m Yassine Kooli
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-3 text-gray-900 dark:text-white">
          <TypewriterText texts={ROLES} />
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-[38rem] mx-auto leading-relaxed mb-2">
          {t('intro.experience')} of experience building{" "}
          <span className="font-semibold text-gray-800 dark:text-white">scalable web applications</span>{" "}
          with{" "}
          <span className="underline underline-offset-2 decoration-secondary-500 font-medium">
            Laravel, Filament &amp; Livewire
          </span>.
        </p>

        {/* Availability badge */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Available for work</span>
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="flex flex-col items-center gap-3 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <Link
            href="#contact"
            className="group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white px-7 py-3.5 flex items-center justify-center gap-2 rounded-full font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 active:scale-100 transition-all duration-200 w-full sm:w-auto"
            onClick={() => {
              setActiveSection("Contact");
              setTimeOfLastClick(Date.now());
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('intro.contactButton')}
              <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <a
            className="group bg-white/80 dark:bg-white/10 backdrop-blur-sm px-7 py-3.5 flex items-center justify-center gap-2 rounded-full font-medium border border-black/10 dark:border-white/15 hover:scale-105 hover:bg-white dark:hover:bg-white/20 active:scale-100 transition-all duration-200 cursor-pointer w-full sm:w-auto"
            href="/CV.pdf"
            download
          >
            {t('intro.downloadCV')}
            <HiDownload className="opacity-60 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Social links */}
        <div className="flex gap-2 mt-1">
          <a
            className="bg-white/80 dark:bg-white/10 backdrop-blur-sm p-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full border border-black/10 dark:border-white/15 hover:scale-110 hover:shadow-md transition-all duration-200"
            href="https://www.linkedin.com/in/yassine-kooli/"
            target="_blank"
            aria-label="LinkedIn"
          >
            <BsLinkedin className="text-lg" />
          </a>

          <a
            className="bg-white/80 dark:bg-white/10 backdrop-blur-sm p-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full border border-black/10 dark:border-white/15 hover:scale-110 hover:shadow-md transition-all duration-200"
            href="https://github.com/Yassine-Kooli"
            target="_blank"
            aria-label="GitHub"
          >
            <FaGithubSquare className="text-xl" />
          </a>

          <a
            className="bg-white/80 dark:bg-white/10 backdrop-blur-sm p-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-full border border-black/10 dark:border-white/15 hover:scale-110 hover:shadow-md transition-all duration-200"
            href="https://www.upwork.com/freelancers/~01e5595c71628fd231?viewMode=1"
            target="_blank"
            aria-label="Upwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
              <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
            </svg>
          </a>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="mt-12 flex items-center justify-center gap-8 sm:gap-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {[
          { value: "4+", label: "Years Experience" },
          { value: "10+", label: "Projects Delivered" },
          { value: "100%", label: "Client Satisfaction" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
