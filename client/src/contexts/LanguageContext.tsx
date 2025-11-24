import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@shared/translations';
import { getTranslation, getAllTranslations } from '@shared/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: ReturnType<typeof getAllTranslations>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pl');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'pl' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => getTranslation(language, key);
  const translations = getAllTranslations(language);

  if (!isLoaded) {
    return <div>{getTranslation('pl', 'common.loading')}</div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
