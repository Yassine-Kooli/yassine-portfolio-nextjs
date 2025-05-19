"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeading from "./section-heading";
import { useInView } from "react-intersection-observer";
import { testimonialData } from "@/lib/data";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Testimonials() {
  const { ref } = useInView({ threshold: 0.5 });
  const { t } = useTranslation();

  return (
    <section
      ref={ref}
      id="testimonials"
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading translationKey="testimonials.title" />
      <div className="mt-8 grid grid-cols-1 gap-6 px-4 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
        {testimonialData.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center rounded-xl bg-white p-4 sm:p-6 shadow-md dark:bg-white/10"
          >
            <div className="relative mb-4 h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mb-2 text-base sm:text-lg font-medium text-primary-600 dark:text-primary-400">
              {testimonial.name}
            </p>
            <p className="mb-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {testimonial.title}
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              "{testimonial.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
