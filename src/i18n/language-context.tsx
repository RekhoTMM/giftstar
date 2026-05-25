import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import ka from "./ka.json";
import en from "./en.json";
import ru from "./ru.json";

export type Language = "ka" | "en" | "ru";

const translations: Record<Language, typeof ka> = { ka, en, ru };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
  tArray: (path: string) => any[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("giftstar-lang");
    return (saved as Language) || "ka";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("giftstar-lang", lang);
  }, []);

  const t = useCallback(
    (path: string): string => {
      const value = getNestedValue(translations[language], path);
      return typeof value === "string" ? value : path;
    },
    [language]
  );

  const tArray = useCallback(
    (path: string): any[] => {
      const value = getNestedValue(translations[language], path);
      return Array.isArray(value) ? value : [];
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
