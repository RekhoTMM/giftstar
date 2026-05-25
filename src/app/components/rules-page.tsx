import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { useLanguage } from "../../i18n/language-context";

export function RulesPage() {
  const { t, tArray } = useLanguage();
  const rules = tArray("rules.sections") as { title: string; items: string[] }[];

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[#0068ff] mb-6 hover:opacity-80 transition-opacity"
        style={{ fontSize: '0.875rem', fontWeight: 500 }}
      >
        <ArrowLeft className="w-4 h-4" />
        {t("rules.back")}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#e6f0ff] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#0068ff]" />
          </div>
          <div>
            <h1 className="text-[#002a38]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {t("rules.title")}
            </h1>
            <p className="text-gray-400" style={{ fontSize: '0.8125rem' }}>
              {t("rules.subtitle")}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {rules.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-[#002a38] mb-3" style={{ fontSize: '1.0625rem', fontWeight: 600 }}>
                {i + 1}. {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.items.map((item, j) => {
                  // Detect [linkText] pattern and render as clickable link
                  const linkMatch = item.match(/^(.*)\[(.+)\](.*)$/);
                  return (
                    <li key={j} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0068ff] mt-2.5 shrink-0" />
                      <p className="text-gray-600" style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
                        {linkMatch ? (
                          <>
                            {linkMatch[1]}
                            <a href="#" className="text-[#0068ff] underline underline-offset-2" style={{ fontWeight: 500 }}>
                              {linkMatch[2]}
                            </a>
                            {linkMatch[3]}
                          </>
                        ) : item}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-[#f8f7fc] rounded-2xl">
          <p className="text-gray-500 text-center" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
            {t("rules.lastUpdated")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
