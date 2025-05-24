"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { useTranslation } from "@/lib/hooks";

export default function About() {
  const { ref } = useSectionInView("About");
  const { t } = useTranslation();

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading translationKey="about.title" />
      <p className="mb-3">
        {t('about.description')}
      </p>

      <p className="mb-3">
        {t('about.background')}
      </p>

      <p>
        {t('about.approach')}
      </p>
    </motion.section>
  );
}
