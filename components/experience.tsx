"use client";

import React from "react";
import SectionHeading from "./section-heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiencesData } from "@/lib/data";
import { useSectionInView, useTranslation } from "@/lib/hooks";
import { useTheme } from "@/context/theme-context";

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading translationKey="experience.title" />
      <VerticalTimeline lineColor={theme === "light" ? "#e5e7eb" : "rgba(255, 255, 255, 0.2)"}>
        {experiencesData.map((item, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
              contentStyle={{
                background:
                  theme === "light"
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255, 255, 255, 0.05)",
                boxShadow: theme === "light"
                  ? "0 4px 24px rgba(79,70,229,0.08)"
                  : "none",
                border: theme === "light"
                  ? "1px solid rgba(79,70,229,0.12)"
                  : "1px solid rgba(255,255,255,0.08)",
                textAlign: "left",
                padding: "1.4rem 2rem",
                borderRadius: "1rem",
                backdropFilter: "blur(8px)",
              }}
              contentArrowStyle={{
                borderRight:
                  theme === "light"
                    ? "0.4rem solid rgba(79,70,229,0.3)"
                    : "0.4rem solid rgba(255, 255, 255, 0.15)",
              }}
              date={t(item.dateKey)}
              icon={item.icon}
              iconStyle={{
                background: theme === "light"
                  ? "linear-gradient(135deg, #4f46e5, #0d9488)"
                  : "linear-gradient(135deg, #818cf8, #2dd4bf)",
                color: "white",
                fontSize: "1.3rem",
                boxShadow: "0 0 0 3px rgba(79,70,229,0.2)",
              }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white">{t(item.titleKey)}</h3>
              <p className="font-medium !mt-0.5 text-primary-600 dark:text-primary-400 text-sm">{t(item.locationKey)}</p>
              <p className="!mt-2 !font-normal text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                {t(item.descriptionKey)}
              </p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
}
