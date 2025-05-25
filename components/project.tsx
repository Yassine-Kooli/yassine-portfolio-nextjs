"use client";

import { useRef, useState } from "react";
import { projectsData } from "@/lib/data";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import ImageModal from "./image-modal";

type ProjectProps = (typeof projectsData)[number];

export default function Project({
  title,
  description,
  tags,
  images,
  link,
}: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>(images[0] || "");

  // Open modal with the image
  const openModal = (imageSrc: string) => {
    setModalImageSrc(imageSrc);
    setIsModalOpen(true);
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      className="group mb-3 sm:mb-8 last:mb-0"
    >
      <section className="bg-white max-w-[42rem] border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative hover:bg-gray-50 transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        {/* Mobile image - shown only on small screens */}
        <div
          className="block sm:hidden w-full h-48 relative overflow-hidden cursor-pointer"
          onClick={() => openModal(images[0])}
        >
          <Image
            src={images[0]}
            alt={`Screenshot of ${title} project`}
            fill
            className="object-cover"
            quality={85}
          />
        </div>

        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[18rem] sm:h-[20rem]">
          <h3 className="text-xl sm:text-2xl font-semibold text-primary-600 dark:text-primary-400">{title}</h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70 text-sm sm:text-base">
            {description}
          </p>
          <div className="flex mt-4 gap-3">
            {link && (
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary-600 dark:text-white/70 dark:hover:text-primary-400 transition"
                aria-label={`View ${title} on GitHub`}
              >
                <FaGithub className="text-xl" />
              </Link>
            )}
            {/* Add demo link if available */}
            {/* <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-primary-600 dark:text-white/70 dark:hover:text-primary-400 transition"
              aria-label={`View ${title} live demo`}
            >
              <FaExternalLinkAlt className="text-lg" />
            </Link> */}
          </div>
          <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-primary-100 text-primary-700 px-2 py-1 text-[0.65rem] sm:text-[0.7rem] sm:px-3 uppercase tracking-wider rounded-full dark:bg-primary-900/30 dark:text-primary-300"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop image - hidden on small screens */}
        <div
          className="absolute hidden sm:block top-8 -right-40 w-[28.25rem] h-[18rem] rounded-t-lg shadow-2xl overflow-hidden cursor-pointer group-even:right-[initial] group-even:-left-40"
          onClick={() => openModal(images[0])}
        >
          <Image
            src={images[0]}
            alt={`Screenshot of ${title} project`}
            fill
            quality={95}
            className="object-cover"
          />
        </div>
      </section>

      {/* Image Modal - Moved outside the section for better positioning */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={modalImageSrc}
        imageAlt={`${title} project image`}
      />
    </motion.div>
  );
}
