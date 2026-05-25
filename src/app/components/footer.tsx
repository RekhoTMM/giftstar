import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import logoSvg from "../../assets/logo.svg";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, type Language } from "../../i18n/language-context";

const LANGS: { code: Language; flag: string; name: string }[] = [
  { code: "ka", flag: "🇬🇪", name: "ქართული" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
];

export function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGS.find((l) => l.code === language) || LANGS[0];

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  return (
    <footer className="site-footer bg-[#fafafa] border-t border-gray-100" style={{ width: "100%" }}>
      <div className="footer-container flex flex-col" style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", padding: "var(--space-3xl) var(--space-header-px)" }}>
        {/* Footer top — stacks on mobile, side-by-side on desktop */}
        <div className="footer-top flex flex-col lg:flex-row lg:justify-between lg:gap-16 mb-8">
          {/* Left column: Logo, language, description */}
          <div className="footer-left flex flex-col mb-8 lg:mb-0 lg:flex-1">
            <div className="footer-header flex items-center justify-between lg:justify-start lg:gap-4 mb-6">
              <div className="footer-logo flex items-center gap-2">
                <img src={logoSvg} alt="GiftMe.ge" className="w-7 h-7" style={{ filter: "drop-shadow(0 8px 24px rgba(0,104,255,0.35))" }} />
                <span className="text-[#0068ff] tracking-tight leading-none translate-y-[1px]" style={{ fontSize: '1rem', fontWeight: 700 }}>
                  GiftMe<span className="text-[#002a38]">.ge</span>
                </span>
              </div>

              {/* Language Dropdown */}
              <div className="footer-language-switcher relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center gap-1.5 px-2.5 transition-all duration-200"
                >
                  <span className="flex-shrink-0 translate-y-[1px]" style={{ fontSize: "1.15rem", lineHeight: 1 }}>{currentLang.flag}</span>
                  <span className="text-[#002a38]" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{currentLang.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-full mb-2 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-[60] min-w-[160px]"
                    >
                      {LANGS.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                            language === lang.code
                              ? "bg-[#e6f0ff]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex-shrink-0" style={{ fontSize: "1.25rem", lineHeight: 1, verticalAlign: "middle" }}>{lang.flag}</span>
                          <span
                            className={language === lang.code ? "text-[#0068ff]" : "text-[#002a38]"}
                            style={{ fontSize: "0.875rem", fontWeight: language === lang.code ? 700 : 500 }}
                          >
                            {lang.name}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <p className="text-gray-500 lg:max-w-sm" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
              {t("footer.description")}
            </p>

            <div className="footer-links flex flex-wrap gap-x-6 gap-y-2 mt-6">
              <Link
                to="/rules"
                className="text-gray-500 hover:text-[#0068ff] transition-colors duration-200"
                style={{ fontSize: '0.8125rem', fontWeight: 500 }}
              >
                {t("footer.siteRules")}
              </Link>
            </div>
          </div>

          {/* Right column: Contact info */}
          <div className="footer-right flex flex-col">
            <div className="footer-contact-list flex flex-col" style={{ gap: "var(--space-md)" }}>
              <div className="footer-contact-item flex items-center gap-3 transition-all duration-200 hover:translate-x-0.5">
                <div className="w-8 h-8 rounded-lg bg-[#e6f0ff] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#0068ff]" />
                </div>
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>+995 XXX XXX XXX</span>
              </div>
              <div className="footer-contact-item flex items-center gap-3 transition-all duration-200 hover:translate-x-0.5">
                <div className="w-8 h-8 rounded-lg bg-[#e6f0ff] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#0068ff]" />
                </div>
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>info@giftme.ge</span>
              </div>
              <div className="footer-contact-item flex items-center gap-3 transition-all duration-200 hover:translate-x-0.5">
                <div className="w-8 h-8 rounded-lg bg-[#e6f0ff] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#0068ff]" />
                </div>
                <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>{t("footer.city")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="footer-copyright border-t border-gray-200 pt-6">
          <p className="text-gray-400 text-center" style={{ fontSize: '0.75rem' }}>
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
