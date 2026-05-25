import { Star, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../i18n/language-context";
import logoSvg from "../../assets/logo.svg";

interface PurchaseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucherName: string;
  voucherStars: number;
  currentStars: number;
  isLoading?: boolean;
  voucherId?: string;
}

export function PurchaseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  voucherName,
  voucherStars,
  currentStars,
  isLoading = false,
  voucherId,
}: PurchaseConfirmationModalProps) {
  const { t } = useLanguage();
  const remainingStars = currentStars - voucherStars;
  const canAfford = currentStars >= voucherStars;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header gradient */}
            <div
              className="pt-8 pb-6 px-6 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #e6f0ff 0%, #d6e6ff 50%, #e6f0ff 100%)",
              }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0068ff]/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#0068ff]/5 rounded-full blur-xl" />

              <motion.img
                src={logoSvg}
                alt="GiftMe.ge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4"
                style={{ filter: "drop-shadow(0 8px 24px rgba(0,104,255,0.35))" }}
              />

              <h3
                className="text-[#002a38] mb-1"
                style={{ fontSize: "1.25rem", fontWeight: 800 }}
              >
                {t("purchase.title")}
              </h3>
              <p className="text-gray-500" style={{ fontSize: "0.8125rem" }}>
                {t("purchase.subtitle")}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {/* Voucher info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {t("purchase.voucher")}
                  </span>
                  <span
                    className="text-[#002a38]"
                    style={{ fontSize: "0.9375rem", fontWeight: 700 }}
                  >
                    {voucherName}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {t("purchase.cost")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
                    <span
                      className="text-[#002a38]"
                      style={{ fontSize: "0.9375rem", fontWeight: 700 }}
                    >
                      {voucherStars}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                  <span className="text-gray-500" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                    {t("purchase.balanceAfter")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
                    <span
                      className={canAfford ? "text-[#002a38]" : "text-red-500"}
                      style={{ fontSize: "0.9375rem", fontWeight: 700 }}
                    >
                      {remainingStars}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning if low balance */}
              {canAfford && remainingStars < 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-4"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-amber-700" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
                    {t("purchase.lowBalance").replace("{count}", String(remainingStars))}
                  </p>
                </motion.div>
              )}

              {/* Age restriction for კროკოსქარდი */}
              {voucherId === "krokoCard" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-[#e8f5e0] border border-[#B0E89F] rounded-xl px-3 py-2.5 mb-4"
                >
                  <AlertTriangle className="w-4 h-4 text-[#3FA62E] shrink-0" />
                  <p className="text-[#2D8A1E]" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
                    {t("purchase.ageRestriction")}
                  </p>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                  style={{ fontWeight: 600, fontSize: "0.9375rem" }}
                >
                  {t("purchase.cancel")}
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onConfirm}
                  disabled={isLoading || !canAfford}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ fontWeight: 600, fontSize: "0.9375rem" }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    t("purchase.confirm")
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
