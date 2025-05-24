"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoLanguage } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { useLanguage } from "@/context/language-context";
import { Language as LanguageType } from "@/lib/translations";

type LanguageOption = {
  code: LanguageType;
  name: string;
  flag: string;
};

const languages: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  // Find the selected language object
  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".language-switcher")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (language: LanguageOption) => {
    setLanguage(language.code);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 rounded-full bg-white p-2 text-gray-700 transition hover:text-primary-600 dark:bg-white/10 dark:text-white/60 dark:hover:text-primary-400"
        aria-label="Change language"
      >
        <span className="mr-1">{selectedLanguage.flag}</span>
        <IoLanguage className="text-lg" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 rounded-md bg-white py-2 shadow-lg dark:bg-gray-800"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white/80 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <span className="mr-2">{language.flag}</span>
                  {language.name}
                </div>
                {selectedLanguage.code === language.code && (
                  <FiCheck className="text-primary-600 dark:text-primary-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
