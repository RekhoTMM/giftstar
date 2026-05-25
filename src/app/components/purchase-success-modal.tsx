import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../../i18n/language-context";

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherName: string;
  voucherCode: string;
  voucherImage: string;
  expiryText: string;
}

export function PurchaseSuccessModal({
  isOpen,
  onClose,
  voucherName,
  voucherCode,
  voucherImage,
  expiryText,
}: PurchaseSuccessModalProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(voucherCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewVoucher = () => {
    onClose();
    navigate("/dashboard", { state: { tab: "vouchers" } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Success header */}
            <div className="pt-6 pb-4 px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.15 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-8 h-8 text-green-600" />
              </motion.div>
              <h2 className="text-[#002a38] mb-1" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                {t("purchase.successTitle")}
              </h2>
            </div>

            {/* Voucher card */}
            <div className="px-6 pb-4">
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                {/* Voucher image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <ImageWithFallback
                    src={voucherImage}
                    alt={voucherName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Voucher info */}
                <div className="p-4">
                  <h3 className="text-[#002a38] mb-1" style={{ fontSize: "1rem", fontWeight: 700 }}>
                    {voucherName}
                  </h3>
                  <p className="text-gray-400 mb-4" style={{ fontSize: "0.75rem" }}>
                    {expiryText}
                  </p>

                  {/* Voucher code */}
                  <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5 border border-gray-200">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 mb-0.5" style={{ fontSize: "0.625rem", fontWeight: 500 }}>
                        {t("purchase.code")}
                      </p>
                      <span
                        className="text-[#002a38] tracking-wider block"
                        style={{ fontSize: "0.9375rem", fontWeight: 700, letterSpacing: "0.05em" }}
                      >
                        {voucherCode}
                      </span>
                    </div>
                    <button
                      onClick={copyCode}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all shrink-0 ${
                        copied
                          ? "bg-green-100 text-green-600"
                          : "bg-[#e6f0ff] text-[#0068ff] hover:bg-[#d6e6ff]"
                      }`}
                      style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          {t("dashboard.copied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          {t("dashboard.copy")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col gap-2.5">
              <button
                onClick={handleViewVoucher}
                className="w-full py-3.5 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all flex items-center justify-center"
                style={{ fontWeight: 600, fontSize: "0.9375rem" }}
              >
                {t("purchase.viewVoucher")}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-2xl transition-all"
                style={{ fontWeight: 500, fontSize: "0.875rem" }}
              >
                {t("purchase.close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
