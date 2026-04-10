import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [lang, setLang] = useState(() => {
    // Try to get saved language, default to en
    const saved = localStorage.getItem("app_lang");
    return saved && translations[saved] ? saved : "en";
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem("app_lang", lang);
  }, [lang]);

  const cycleLanguage = () => {
    const langs = ["en", "hi", "gu"];
    const currentIndex = langs.indexOf(lang);
    setLang(langs[(currentIndex + 1) % langs.length]);
  };

  const t = (key) => {
    const dict = translations[lang] || translations["en"];
    return dict[key] || translations["en"][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, cycleLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
