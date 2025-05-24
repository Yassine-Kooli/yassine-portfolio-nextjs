import enTranslations from '@/messages/en/index.json';
import frTranslations from '@/messages/fr/index.json';

type TranslationKey = string;

const translations = {
  en: enTranslations,
  fr: frTranslations,
};

export type Language = 'en' | 'fr';

/**
 * Get a translation by key and language
 * @param key Dot notation key (e.g., "navigation.home")
 * @param language Language code
 * @returns Translated string
 */
export function getTranslation(key: TranslationKey, language: Language): string {
  // Split the key by dots to navigate the nested object
  const keys = key.split('.');
  
  // Start with the translations for the specified language
  let result: any = translations[language];
  
  // Navigate through the nested object
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // If key not found, fall back to English
      console.warn(`Translation key "${key}" not found for language "${language}". Falling back to English.`);
      
      result = translations.en;
      for (const fallbackKey of keys) {
        if (result && typeof result === 'object' && fallbackKey in result) {
          result = result[fallbackKey];
        } else {
          console.error(`Translation key "${key}" not found in fallback language (English).`);
          return key; // Return the key itself as last resort
        }
      }
      break;
    }
  }
  
  return result || key;
}

/**
 * Create a translation function for a specific language
 * @param language Language code
 * @returns Function that takes a key and returns the translation
 */
export function createTranslator(language: Language) {
  return (key: TranslationKey) => getTranslation(key, language);
}
