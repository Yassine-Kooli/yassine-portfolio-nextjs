"use client";

import { useRef, useState } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import ImageModal from "./image-modal";

type ProjectProps = (typeof projectsData)[number] & { index?: number };

export default function Project({ title, description, tags, images, link, index = 0 }: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  const gradients = [
    "from-violet-500/20 via-transparent to-transparent",
    "from-teal-500/20 via-transparent to-transparent",
    "from-blue-500/20 via-transparent to-transparent",
    "from-rose-500/20 via-transparent to-transparent",
    "from-amber-500/20 via-transparent to-transparent",
    "from-emerald-500/20 via-transparent to-transparent",
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className="group mb-4 sm:mb-6 last:mb-0">
      <div className={`relative bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden hover:border-primary-300/50 dark:hover:border-primary-600/40 hover:shadow-xl hover:shadow-primary-100/30 dark:hover:shadow-primary-900/20 transition-all duration-300 max-w-[42rem]`}>
        {/* Gradient accent */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Mobile image */}
        <div
          className="block sm:hidden w-full h-44 relative overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[0]}
            alt={`${title} project`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative z-10 pt-5 pb-7 px-6 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[55%] flex flex-col sm:h-[20rem] sm:group-even:ml-[18rem]">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-600 dark:text-white/65 text-sm flex-1">
            {description}
          </p>

          <div className="flex items-center gap-3 mt-4">
            {link && !link.includes("yourusername") && (
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-white/60 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                aria-label={`${title} on GitHub`}
              >
                <FaGithub className="text-base" />
                <span>Code</span>
              </Link>
            )}
          </div>

          <ul className="flex flex-wrap mt-4 gap-1.5 sm:mt-auto">
            {tags.map((tag, i) => (
              <li
                key={i}
                className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/40 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider rounded-full font-medium"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop image */}
        <div
          className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] h-[18rem] rounded-xl shadow-2xl overflow-hidden cursor-pointer group-even:right-[initial] group-even:-left-40 transition-transform duration-500 group-hover:-translate-y-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[0]}
            alt={`${title} project`}
            fill
            quality={95}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent" />
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={images[0]}
        imageAlt={`${title} project`}
      />
    </motion.div>
  );
}
