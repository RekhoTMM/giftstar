import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Star, ChevronDown, ArrowDown, Check, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import { useLanguage } from "../../i18n/language-context";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AuthModal } from "./auth-modal";
import { PurchaseConfirmationModal } from "./purchase-confirmation-modal";
import { PurchaseSuccessModal } from "./purchase-success-modal";
import { vouchers } from "./voucher-data";

const PROMO_STARS: Record<string, number> = {
  GIFT10: 10, STAR20: 20, PROMO5: 5, BONUS15: 15, VIP50: 50,
};

interface HeroSectionProps {
  onRegister: () => void;
  selectedVoucherIndex: number | null;
  onSelectVoucher: (index: number | null) => void;
}

export function HeroSection({ onRegister: _onRegister, selectedVoucherIndex, onSelectVoucher }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #f0f5ff 0%, rgba(214,230,255,0.3) 50%, transparent 100%)",
        width: "100%",
      }}
    >
      {/* Floating star decorations — desktop */}
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ bottom: "10%", left: "12%", width: "76px", height: "76px", borderRadius: "20px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 14px 40px rgba(143,212,119,0.12)" }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 0.5, scale: 1, y: [0, -10, 0], rotate: [0, 2, 0] }} transition={{ opacity: { duration: 0.7, delay: 1.0 }, scale: { duration: 0.7, delay: 1.0 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 } }}>
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ top: "8%", right: "5%", width: "76px", height: "76px", borderRadius: "20px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 10px 28px rgba(143,212,119,0.1)" }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 0.5, scale: 1, y: [0, 8, 0], rotate: [0, -3, 0] }} transition={{ opacity: { duration: 0.7, delay: 1.15 }, scale: { duration: 0.7, delay: 1.15 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 } }}>
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ top: "62%", right: "20%", width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 10px 24px rgba(143,212,119,0.1)" }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 0.5, scale: 1, y: [0, -7, 0], rotate: [0, 4, 0] }} transition={{ opacity: { duration: 0.7, delay: 1.3 }, scale: { duration: 0.7, delay: 1.3 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 } }}>
        <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      {/* Floating star decorations — mobile */}
      <motion.div aria-hidden="true" className="absolute pointer-events-none flex md:hidden items-center justify-center" style={{ top: "5%", right: "20%", width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 6px 16px rgba(143,212,119,0.1)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1, y: [0, -6, 0], rotate: [0, -4, 0] }} transition={{ opacity: { duration: 0.6, delay: 1.45 }, scale: { duration: 0.6, delay: 1.45 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 } }}>
        <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ top: "22%", left: "7%", width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 6px 14px rgba(143,212,119,0.08)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1, y: [0, 6, 0], rotate: [0, 4, 0] }} transition={{ opacity: { duration: 0.6, delay: 1.6 }, scale: { duration: 0.6, delay: 1.6 }, y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 }, rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 } }}>
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none flex md:hidden items-center justify-center" style={{ bottom: "8%", right: "12%", width: "30px", height: "30px", borderRadius: "9px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 6px 14px rgba(143,212,119,0.08)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1, y: [0, -5, 0], rotate: [0, -3, 0] }} transition={{ opacity: { duration: 0.6, delay: 1.75 }, scale: { duration: 0.6, delay: 1.75 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 } }}>
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      <div
        className="relative z-10 px-5"
        style={{
          maxWidth: "var(--size-container-max)",
          margin: "0 auto",
          paddingTop: "var(--space-hero-pt)",
          paddingBottom: "var(--space-hero-pb)",
        }}
      >
        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="text-center mb-6">
          <h1 className="text-[#002a38]" style={{ fontSize: "clamp(1.875rem, 3.4vw, 2.5rem)", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            {t("hero.guest.headline1")}{" "}
            <span className="relative inline-block px-1.5">
              <span className="absolute bg-[#B0E89F] rounded-md -skew-x-2" style={{ top: "15%", bottom: "3%", left: "-1%", right: "-1%" }} />
              <span className="relative">{t("hero.guest.headline2")}</span>
            </span>{" "}
            {t("hero.guest.headline3")}
          </h1>
        </motion.div>

        <SwapPanel selectedIndex={selectedVoucherIndex} onSelectVoucher={onSelectVoucher} />
      </div>
    </section>
  );
}

/* ─── Shared Voucher Picker Modal ─── */
interface VoucherPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

function VoucherPickerModal({ isOpen, onClose, selectedIndex, onSelect }: VoucherPickerModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      const header = document.querySelector(".site-header") as HTMLElement | null;
      if (header) header.style.zIndex = "0";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        if (header) header.style.zIndex = "";
      };
    }
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-200 rounded-full" />
              <h3 className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
                აირჩიე სასურველი ვაუჩერი
              </h3>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 sm:p-8 grid grid-cols-2 gap-3 overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] max-h-[29rem] sm:max-h-[38rem]">
              {vouchers.map((v, i) => {
                const isSel = selectedIndex === i;
                return (
                  <button key={v.id} onClick={() => { onSelect(i); onClose(); }} className="group text-left">
                    <div
                      className={`rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 p-[1px] hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-0.5 ${isSel ? "shadow-md shadow-[#0068ff]/20" : ""}`}
                      style={{ background: isSel ? "#0068ff" : "#e5e7eb" }}
                    >
                      <div className="relative bg-white rounded-[calc(1rem-1px)] overflow-hidden flex flex-col h-full">
                        <div className="relative overflow-hidden bg-gray-50 aspect-[5/3]">
                          <ImageWithFallback src={v.image} alt={t(`vouchers.cards.${v.translationKey}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-3.5 flex flex-col flex-1">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-2.5 h-2.5 text-gray-300 shrink-0" />
                            <span className="text-gray-400" style={{ fontSize: "0.5625rem", fontWeight: 500 }}>{t(`vouchers.cards.${v.translationKey}.expiry`)}</span>
                          </div>
                          <h4 className="text-[#002a38] mb-0.5" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{t(`vouchers.cards.${v.translationKey}.name`)}</h4>
                          <p className="text-gray-400 mb-2" style={{ fontSize: "0.625rem", lineHeight: 1.4 }}>{t(`vouchers.cards.${v.translationKey}.desc`)}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
                              <span className="text-[#002a38]" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{v.stars}</span>
                            </div>
                            <div className={`rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 ${isSel ? "bg-[#0068ff]" : "bg-[#e6f0ff] group-hover:bg-[#0068ff]"}`}>
                              <Check className={`w-3.5 h-3.5 transition-colors duration-200 ${isSel ? "text-white" : "text-[#0068ff] group-hover:text-white"}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ─── Shared purchase hook logic ─── */
function usePurchaseFlow(selectedIndex: number | null) {
  const { user, purchaseVoucher } = useAuth();
  const { t } = useLanguage();
  const selected = selectedIndex !== null ? vouchers[selectedIndex] : null;
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, voucherId: "", name: "", stars: 0, image: "", expiryKey: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, name: "", code: "", image: "", expiry: "" });

  const openConfirm = () => {
    if (!selected) return;
    setConfirmModal({
      isOpen: true,
      voucherId: selected.id,
      name: t(`vouchers.cards.${selected.translationKey}.name`),
      stars: selected.stars,
      image: selected.image,
      expiryKey: selected.translationKey,
    });
  };

  const handleConfirm = () => {
    const { voucherId, name, stars, image, expiryKey } = confirmModal;
    setConfirmModal((p) => ({ ...p, isOpen: false }));
    setIsPurchasing(true);
    setTimeout(() => {
      const result = purchaseVoucher(voucherId, name, stars);
      if (result.success) {
        setSuccessModal({ isOpen: true, name, code: result.voucherCode!, image, expiry: t(`vouchers.cards.${expiryKey}.expiry`) });
      } else {
        toast.error(result.message);
      }
      setIsPurchasing(false);
    }, 1200);
  };

  return { isPurchasing, confirmModal, setConfirmModal, successModal, setSuccessModal, openConfirm, handleConfirm, user };
}

/* ─── Two-step swap panel ─── */
function SwapPanel({ selectedIndex, onSelectVoucher }: { selectedIndex: number | null; onSelectVoucher: (index: number | null) => void }) {
  const { isAuthenticated, redeemPromoCode } = useAuth();
  const { t } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [pickerHighlight, setPickerHighlight] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const selectedChipRef = useRef<HTMLButtonElement>(null);
  const COLLAPSED_COUNT = 2;

  useEffect(() => {
    if (selectedIndex !== null) {
      setPickerHighlight(true);
      // If the selection (e.g. from the grid below the hero) is one of the
      // collapsed items, expand the list so it becomes visible.
      if (selectedIndex >= COLLAPSED_COUNT) setExpanded(true);
      const timer = setTimeout(() => setPickerHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex]);

  // Scroll the selected row into view once it is actually rendered (after any
  // expansion has applied).
  useEffect(() => {
    if (selectedIndex !== null && (selectedIndex < COLLAPSED_COUNT || expanded)) {
      selectedChipRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIndex, expanded]);

  const [promoInput, setPromoInput] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState<number | null>(null);

  const { isPurchasing, confirmModal, setConfirmModal, successModal, setSuccessModal, openConfirm, handleConfirm, user } = usePurchaseFlow(selectedIndex);

  const previewStars = PROMO_STARS[promoInput.trim().toUpperCase()];
  const selected = selectedIndex !== null ? vouchers[selectedIndex] : null;

  // Authenticated users with a selection that costs more than their balance.
  const isShort = isAuthenticated && !!selected && !!user && user.stars < selected.stars;
  const shortfall = isShort && selected && user ? selected.stars - user.stars : 0;

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    if (!isAuthenticated) { setAuthMode("register"); setShowAuth(true); return; }
    setIsRedeeming(true);
    setPromoError("");
    setTimeout(() => {
      const result = redeemPromoCode(promoInput);
      if (result.success) {
        const earned = PROMO_STARS[promoInput.trim().toUpperCase()] ?? 0;
        setPromoSuccess(earned);
        setPromoInput("");
        setTimeout(() => setPromoSuccess(null), 2500);
      } else {
        setPromoError(result.message);
      }
      setIsRedeeming(false);
    }, 800);
  };

  const handleExchange = () => {
    if (!isAuthenticated) { setAuthMode("register"); setShowAuth(true); return; }
    if (isShort) return;
    openConfirm();
  };

  const renderVoucherRow = (v: (typeof vouchers)[number], i: number) => {
    const isSel = selectedIndex === i;
    return (
      <button
        key={v.id}
        ref={isSel ? selectedChipRef : undefined}
        onClick={() => onSelectVoucher(i)}
        aria-pressed={isSel}
        className={`group flex items-center gap-3 w-full text-left rounded-2xl border p-2 pr-3 transition-all duration-200 hover:shadow-md hover:shadow-gray-200/70 ${isSel ? "border-[#0068ff] bg-[#f5f9ff] shadow-sm shadow-[#0068ff]/10" : "border-gray-200 bg-white"} ${isSel && pickerHighlight ? "ring-2 ring-[#0068ff]/30" : ""}`}
      >
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0">
          <ImageWithFallback src={v.image} alt={t(`vouchers.cards.${v.translationKey}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[#002a38] truncate" style={{ fontSize: "0.875rem", fontWeight: 700 }}>{t(`vouchers.cards.${v.translationKey}.name`)}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
              <span className="text-[#002a38]" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{v.stars}</span>
            </span>
            <span className="flex items-center gap-1 min-w-0">
              <Clock className="w-3 h-3 text-gray-300 shrink-0" />
              <span className="text-gray-400 truncate" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>{t(`vouchers.cards.${v.translationKey}.expiry`)}</span>
            </span>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${isSel ? "bg-[#0068ff]" : "bg-[#e6f0ff] group-hover:bg-[#0068ff]"}`}>
          <Check className={`w-3.5 h-3.5 transition-colors duration-200 ${isSel ? "text-white" : "text-[#0068ff] group-hover:text-white"}`} />
        </div>
      </button>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex flex-col gap-3 lg:mx-auto"
        style={{ maxWidth: "var(--size-2col-span, 100%)" }}
      >
        {/* Step 1: Promo code card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${promoSuccess !== null ? "bg-green-500 text-white" : "bg-[#002a38] text-white"}`} style={{ fontSize: "0.75rem", fontWeight: 800 }}>
              {promoSuccess !== null ? <Check className="w-3.5 h-3.5" /> : "1"}
            </span>
            <h3 className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>შეიყვანე პრომო კოდი და მიიღე ვარსკვლავები</h3>
          </div>
          <AnimatePresence mode="wait">
            {promoSuccess !== null ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-green-700" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>+{promoSuccess} {t("hero.swap.promoSuccessLabel")}</p>
                  <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{t("hero.swap.promoBalanceUpdated")}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="relative">
                      <input
                        type="text" value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                        placeholder={t("hero.auth.promoPlaceholder")}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 text-[#002a38] placeholder:text-gray-300 focus:outline-none focus:border-[#0068ff] transition-colors ${previewStars ? "pr-10 pl-3.5" : "px-3.5"}`}
                        style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em" }}
                      />
                      {previewStars && (
                        <motion.span
                          key={previewStars}
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <Check className="w-4 h-4 text-[#3FA62E]" />
                        </motion.span>
                      )}
                    </div>
                    {promoError && <p className="text-red-500" style={{ fontSize: "0.75rem" }}>{promoError}</p>}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>1 ვარსკვლავი = 1 ლ</span>
                      {previewStars && (
                        <motion.span
                          key={`hint-${previewStars}`}
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-[#3FA62E]"
                          style={{ fontSize: "0.75rem", fontWeight: 700 }}
                        >
                          მიიღებ <Star className="w-3 h-3 fill-[#3FA62E]" />{previewStars} ვარსკვლავს
                        </motion.span>
                      )}
                    </div>
                  </div>
                  <button onClick={handleApplyPromo} disabled={isRedeeming || !promoInput.trim()}
                    className="w-full sm:w-auto px-5 py-3 bg-[#002a38] text-white rounded-xl hover:bg-[#003a50] disabled:opacity-50 transition-colors shrink-0 flex items-center justify-center gap-1.5 order-last sm:order-none"
                    style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    {isRedeeming ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "გამოყენება"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step connector */}
        <div className="flex justify-center -my-1 z-10">
          <ArrowDown className="w-4 h-4 text-gray-400" />
        </div>

        {/* Step 2: Voucher + CTA card */}
        <div id="hero-voucher-picker" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="mb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#002a38] text-white flex items-center justify-center shrink-0" style={{ fontSize: "0.75rem", fontWeight: 800 }}>
                2
              </span>
              <h3 className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>გადაცვალე ვარსკვლავები ვაუჩერში</h3>
            </div>
            {isAuthenticated && user && (
              <p className="mt-2 ml-8.5 text-gray-400 flex items-center gap-1" style={{ fontSize: "0.6875rem", fontWeight: 600, marginLeft: "2.125rem" }}>
                {t("hero.swap.balance")}: <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" /> <span className="text-[#002a38]">{user.stars}</span>
              </p>
            )}
          </div>
          {/* Inline voucher selector — vertical list with progressive disclosure */}
          <div className="flex flex-col gap-2">
            {vouchers.slice(0, COLLAPSED_COUNT).map((v, i) => renderVoucherRow(v, i))}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col gap-2"
                >
                  {vouchers.slice(COLLAPSED_COUNT).map((v, i) => renderVoucherRow(v, i + COLLAPSED_COUNT))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {vouchers.length > COLLAPSED_COUNT && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="w-full mt-2 py-2 flex items-center justify-center gap-1 text-[#0068ff] hover:text-[#0050cc] transition-colors"
              style={{ fontSize: "0.8125rem", fontWeight: 600 }}
            >
              {expanded ? t("hero.swap.showLess") : `${t("hero.swap.showMore")} (+${vouchers.length - COLLAPSED_COUNT})`}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
          <button onClick={handleExchange} disabled={isPurchasing || !selected || isShort}
            className={`w-full mt-4 py-4 rounded-2xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed ${isShort ? "bg-gray-100 text-gray-400 disabled:opacity-100" : "bg-[#0068ff] text-white hover:bg-[#0050cc] disabled:opacity-60"}`}
            style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            {isPurchasing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isShort ? (
              <>
                {t("hero.swap.insufficient")}
                <span className="flex items-center gap-1 bg-gray-200/80 rounded-full px-2.5 py-0.5 text-gray-500">
                  {t("hero.swap.needMore")}
                  <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
                  <span style={{ fontSize: "0.875rem", fontWeight: 800 }}>{shortfall}</span>
                </span>
              </>
            ) : (
              <>
                {t("hero.swap.exchangeBtn")}
                {selected && (
                  <span className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                    <span style={{ fontSize: "0.875rem", fontWeight: 800 }}>{selected.stars}</span>
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </motion.div>

      <PurchaseConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal((p) => ({ ...p, isOpen: false }))} onConfirm={handleConfirm} voucherName={confirmModal.name} voucherStars={confirmModal.stars} currentStars={user?.stars ?? 0} isLoading={isPurchasing} voucherId={confirmModal.voucherId} />
      <PurchaseSuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal((p) => ({ ...p, isOpen: false }))} voucherName={successModal.name} voucherCode={successModal.code} voucherImage={successModal.image} expiryText={successModal.expiry} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} mode={authMode} onSwitchMode={(mode) => setAuthMode(mode)} />
    </>
  );
}


/* ─── Mock activation timestamps (used by PromoCodeWithExpiry) ─── */
const MOCK_ACTIVATION_TIMES: Record<string, number> = {};
function getActivationTime(code: string): number {
  if (!MOCK_ACTIVATION_TIMES[code]) {
    const existingCount = Object.keys(MOCK_ACTIVATION_TIMES).length;
    MOCK_ACTIVATION_TIMES[code] = Date.now() - (2 + existingCount * 6) * 60 * 60 * 1000;
  }
  return MOCK_ACTIVATION_TIMES[code];
}

/* ─── Promo Code Badge (used by dashboard) ─── */
export function PromoCodeWithExpiry({ code, variant = "default" }: { code: string; variant?: "default" | "light" }) {
  const starsValue = PROMO_STARS[code] ?? "?";
  const isLight = variant === "light";
  void getActivationTime(code);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${isLight ? "bg-white/10 border border-white/10" : "bg-[#f9fafb] border border-gray-100"}`}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-green-100">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className={`tracking-wider ${isLight ? "text-white" : "text-[#002a38]"}`} style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.06em" }}>{code}</span>
        <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 ${isLight ? "bg-white/15" : "bg-[#e6f0ff]"}`}>
          <Star className={`w-3 h-3 ${isLight ? "text-[#B0E89F] fill-[#B0E89F]" : "text-[#3FA62E] fill-[#3FA62E]"}`} />
          <span className={isLight ? "text-white" : "text-[#0068ff]"} style={{ fontSize: "0.625rem", fontWeight: 700 }}>+{starsValue}</span>
        </div>
      </div>
    </motion.div>
  );
}
