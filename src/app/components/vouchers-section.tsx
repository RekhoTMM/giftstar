import { useState, useEffect } from "react";
import { Star, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../../i18n/language-context";
import { vouchers } from "./voucher-data";

const mysteryBoxPrizes: { nameKey: string; type: "image" | "voucher" | "star" | "x2" | "more"; image?: string; amounts?: string; color?: string }[] = [
  { nameKey: "iPhone", type: "image", image: "https://www.pngall.com/wp-content/uploads/20/iPhone-17-Pro-Max-Concept-Art-PNG.png" },
  { nameKey: "PlayStation", type: "image", image: "https://wallpapers.com/images/featured/ps5-console-png-ywbv2gv3gfw23o3w.jpg" },
  { nameKey: "laptop", type: "image", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop" },
  { nameKey: "tv", type: "image", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop" },
  { nameKey: "krokoShopVoucher", type: "voucher", amounts: "1500 / 500 / 300 / 150 / 50₾", color: "#0068ff" },
  { nameKey: "citrusVoucher", type: "voucher", amounts: "1500 / 500 / 300 / 150 / 50₾", color: "#3FA62E" },
  { nameKey: "krokoCardVoucher", type: "voucher", amounts: "1500 / 500 / 300 / 150 / 50 / 30 / 20₾", color: "#10b981" },
  { nameKey: "voucherValue", type: "x2" },
  { nameKey: "stars", type: "star" },
];

export function VouchersSection() {
  const { t, tArray } = useLanguage();
  const [infoVoucher, setInfoVoucher] = useState<typeof vouchers[number] | null>(null);

  // Lock page scroll when info modal is open
  useEffect(() => {
    if (infoVoucher) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }
  }, [infoVoucher]);

  return (
    <>
      <section className="vouchers-section flex flex-col items-center" style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", padding: "var(--space-2xl) var(--space-lg) 80px", width: "100%" }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="vouchers-section-header text-center mb-10 flex flex-col items-center"
        >
          <div className="vouchers-section-tag inline-flex items-center px-4 py-1.5 bg-[#e6f0ff] rounded-full mb-4">
            <span className="text-[#0068ff]" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
              {t("vouchers.sectionTag")}
            </span>
          </div>
          <h2
            className="text-[#002a38] mb-2"
            style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            {t("vouchers.title")}
          </h2>
          <p className="text-gray-400 max-w-xs lg:max-w-md" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
            {t("vouchers.subtitle")}
          </p>
        </motion.div>

        {/* Voucher Cards — informational only; tap the info icon to learn more */}
        <div className="voucher-cards-grid flex flex-wrap mb-4" style={{ width: "100%", gap: "var(--size-card-gap)" }}>
          {vouchers.map((voucher, i) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="voucher-card-wrapper group"
              style={{ width: "var(--voucher-card-width)" }}
            >
              <div className="voucher-card relative bg-white rounded-2xl overflow-hidden border border-gray-200 flex flex-col h-full transition-shadow duration-200 hover:shadow-md hover:shadow-gray-200/70">
                {/* Mystery BOX prize strip — informational, non-interactive */}
                {voucher.id.startsWith("mysteryBox") && (
                  <div className="absolute top-2 right-2 h-8 flex items-center bg-white/90 rounded-full px-1.5 z-10">
                    {mysteryBoxPrizes.filter(p => p.type === "image").slice(0, 3).map((prize, idx) => (
                      <div
                        key={prize.nameKey}
                        className="w-6 h-6 rounded-full border-[1.5px] border-white overflow-hidden bg-gray-100 shadow-sm"
                        style={{ marginLeft: idx === 0 ? 0 : "-0.25rem", zIndex: 5 - idx }}
                      >
                        <img src={prize.image} alt={t(`vouchers.prizeNames.${prize.nameKey}`)} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <span
                      className="w-6 h-6 rounded-full bg-gray-50 border-[1.5px] border-white flex items-center justify-center shadow-sm"
                      style={{ marginLeft: "-0.25rem", zIndex: 0, fontSize: "0.6875rem", fontWeight: 700 }}
                    >
                      <span className="text-gray-600">+{mysteryBoxPrizes.length - 3}</span>
                    </span>
                  </div>
                )}
                {/* Image */}
                <div className="voucher-card-image relative overflow-hidden bg-gray-50 aspect-[5/3]">
                  <ImageWithFallback
                    src={voucher.image}
                    alt={t(`vouchers.cards.${voucher.translationKey}.name`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="voucher-card-content p-3.5 flex flex-col flex-1">
                  <h3
                    className="text-[#002a38] mb-1"
                    style={{ fontSize: "0.9375rem", fontWeight: 700 }}
                  >
                    {t(`vouchers.cards.${voucher.translationKey}.name`)}
                  </h3>
                  <div className="flex items-end justify-between gap-2.5 mt-auto">
                    <p
                      className="text-gray-400 flex-1 min-w-0"
                      style={{ fontSize: "0.6875rem", lineHeight: 1.5 }}
                    >
                      {t(`vouchers.cards.${voucher.translationKey}.desc`)}
                    </p>
                    <button
                      onClick={() => setInfoVoucher(voucher)}
                      aria-label="Info"
                      className="group/info w-8 h-8 rounded-full bg-[#e6f0ff] hover:bg-[#0068ff] flex items-center justify-center transition-colors shrink-0"
                    >
                      <Info className="w-4 h-4 text-[#0068ff] group-hover/info:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Fill remaining slots in last row with gradient placeholders */}
          {Array.from({ length: ((4 - (vouchers.length % 4)) % 4) }).map((_, i) => (
            <motion.div
              key={`placeholder-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (vouchers.length + i) * 0.08, duration: 0.45 }}
              className="voucher-card-placeholder rounded-2xl overflow-hidden hidden md:block"
              style={{ width: "var(--voucher-card-width)", background: "linear-gradient(180deg, #f3f4f6 0%, #ffffff 100%)", minHeight: 120 }}
            />
          ))}
          {/* Mobile: fill remaining slot in 2-col grid */}
          {vouchers.length % 2 !== 0 && (
            <motion.div
              key="placeholder-mobile"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: vouchers.length * 0.08, duration: 0.45 }}
              className="voucher-card-placeholder rounded-2xl overflow-hidden md:hidden"
              style={{ width: "var(--voucher-card-width)", background: "linear-gradient(180deg, #f3f4f6 0%, #ffffff 100%)", minHeight: 120 }}
            />
          )}
        </div>

      </section>

      {/* Voucher Info Modal — informational */}
      <AnimatePresence>
        {infoVoucher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            onClick={() => setInfoVoucher(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setInfoVoucher(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* Image with drag handle overlay */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* Drag handle (mobile) — floats over image */}
                <div className="sm:hidden absolute top-0 left-0 right-0 z-10 flex justify-center pt-3">
                  <div className="w-10 h-1 bg-white/60 rounded-full" />
                </div>
                <ImageWithFallback
                  src={infoVoucher.image}
                  alt={t(`vouchers.cards.${infoVoucher.translationKey}.name`)}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <h3
                  className="text-[#002a38] mb-1"
                  style={{ fontSize: "1.25rem", fontWeight: 800 }}
                >
                  {t(`vouchers.cards.${infoVoucher.translationKey}.name`)}
                </h3>
                <p className="text-gray-400 mb-4" style={{ fontSize: "0.8125rem" }}>
                  {t(`vouchers.cards.${infoVoucher.translationKey}.desc`)}
                </p>

                {/* Prize list for Mystery BOX */}
                {infoVoucher.id.startsWith("mysteryBox") && (
                  <div className="bg-gray-50 rounded-2xl p-3 mb-4">
                    <div className="mb-3">
                      <span className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{t("vouchers.prizes")}</span>
                    </div>
                    <div className="space-y-2">
                    {mysteryBoxPrizes.map((prize) => (
                      <div key={prize.nameKey} className="flex items-center gap-3">
                        {/* Icon */}
                        {prize.type === "image" && (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex-shrink-0">
                            <img src={prize.image} alt={t(`vouchers.prizeNames.${prize.nameKey}`)} className="w-full h-full object-cover" />
                          </div>
                        )}
                        {prize.type === "voucher" && (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${prize.color}15` }}
                          >
                            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: prize.color }}>₾</span>
                          </div>
                        )}
                        {prize.type === "x2" && (
                          <div className="w-8 h-8 rounded-lg bg-[#e6f0ff] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#0068ff]" style={{ fontSize: "0.6875rem", fontWeight: 800 }}>X2</span>
                          </div>
                        )}
                        {prize.type === "star" && (
                          <div className="w-8 h-8 rounded-lg bg-[#DCEFD2] flex items-center justify-center flex-shrink-0">
                            <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
                          </div>
                        )}
                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <span className="text-[#002a38] block" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                            {t(`vouchers.prizeNames.${prize.nameKey}`)}
                          </span>
                          {prize.type === "voucher" && prize.amounts && (
                            <span className="text-gray-400 block" style={{ fontSize: "0.6875rem" }}>
                              {prize.amounts}
                            </span>
                          )}
                          {prize.type === "star" && (
                            <span className="text-gray-400 block" style={{ fontSize: "0.6875rem" }}>
                              {t("vouchers.star")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <ul className="space-y-2">
                  {tArray(`vouchers.cards.${infoVoucher.translationKey}.details`).map((item, i) => (
                    <li key={i} className="flex gap-2 text-gray-500" style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}>
                      <span className="text-[#0068ff] mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
