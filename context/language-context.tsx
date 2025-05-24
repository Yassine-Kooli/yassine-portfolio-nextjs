"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState<Language>("en");

  // Load saved language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "fr"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLanguage = navigator.language.split("-")[0];
      if (browserLanguage === "fr") {
        setLanguage("fr");
      }
      // Default is already "en"
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Update document direction for RTL languages
    document.documentElement.dir = "ltr";
    document.documentElement.lang = language;
    document.body.classList.remove("font-arabic");
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === null) {
    throw new Error("useLanguage must be used within a LanguageContextProvider");
  }

  return context;
}
