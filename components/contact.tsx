"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/hooks";
import { FiMail, FiUser, FiMessageSquare } from "react-icons/fi";

export default function Contact() {
  const { ref } = useSectionInView("Contact");
  const { t } = useTranslation();

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <SectionHeading translationKey="contact.title" />

      <p className="text-gray-600 dark:text-white/70 -mt-2 mb-8">
        {t('contact.description')}{" "}
        <a
          className="text-primary-600 dark:text-primary-400 font-medium hover:underline underline-offset-2"
          href="mailto:kooli.yassine0@gmail.com"
        >
          kooli.yassine0@gmail.com
        </a>{" "}
        {t('contact.orForm')}.
      </p>

      <form
        className="flex flex-col gap-3"
        action={async (formData) => {
          const { error } = await sendEmail(formData);
          if (error) {
            toast.error(t('contact.errorMessage'));
            return;
          }
          toast.success(t('contact.successMessage'));
        }}
      >
        <div className="relative group">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors text-sm" />
          <input
            className="w-full h-13 pl-11 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/8 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 dark:focus:border-primary-500 transition-all"
            name="senderEmail"
            type="email"
            required
            maxLength={500}
            placeholder={t('contact.emailLabel')}
          />
        </div>

        <div className="relative group">
          <FiMessageSquare className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-500 transition-colors text-sm" />
          <textarea
            className="w-full h-48 pl-11 pr-4 py-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-white/8 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 dark:focus:border-primary-500 transition-all resize-none"
            name="message"
            placeholder={t('contact.messageLabel')}
            required
            maxLength={5000}
          />
        </div>

        <SubmitBtn />
      </form>
    </motion.section>
  );
}
