"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "./section-heading";
import { useInView } from "react-intersection-observer";
import { blogData } from "@/lib/data";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { format } from "date-fns";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Blog() {
  const { ref } = useInView({ threshold: 0.5 });
  const { t } = useTranslation();

  return (
    <section
      ref={ref}
      id="blog"
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40"
    >
      <SectionHeading translationKey="blog.title" />
      <div className="mt-8 grid grid-cols-1 gap-6 px-4 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
        {blogData.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl bg-white p-4 sm:p-6 shadow-md dark:bg-white/10"
          >
            <time className="mb-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(post.date), "MMMM d, yyyy")}
            </time>
            <h3 className="mb-3 text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              {post.title}
            </h3>
            <p className="mb-4 flex-grow text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {post.excerpt}
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="group mt-auto flex items-center text-primary-600 dark:text-primary-400"
            >
              {t('blog.readMore')}{" "}
              <BsArrowRight className="ml-1 transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/blog"
          className="group inline-flex items-center rounded-full bg-primary-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white transition hover:bg-primary-700"
        >
          {t('blog.viewAll')}{" "}
          <BsArrowRight className="ml-1 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
