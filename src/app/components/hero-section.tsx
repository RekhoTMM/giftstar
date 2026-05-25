import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Star, ArrowUpDown, ArrowDown, ChevronDown, ChevronRight, Check, X, Clock, Plus } from "lucide-react";
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
}

export function HeroSection({ onRegister: _onRegister }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");
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
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ bottom: "10%", left: "12%", width: "76px", height: "76px", borderRadius: "20px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 14px 40px rgba(143,212,119,0.12)" }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: [0, 2, 0] }} transition={{ opacity: { duration: 0.7, delay: 1.0 }, scale: { duration: 0.7, delay: 1.0 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 } }}>
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ top: "8%", right: "5%", width: "76px", height: "76px", borderRadius: "20px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 10px 28px rgba(143,212,119,0.1)" }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1, y: [0, 8, 0], rotate: [0, -3, 0] }} transition={{ opacity: { duration: 0.7, delay: 1.15 }, scale: { duration: 0.7, delay: 1.15 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 } }}>
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ top: "62%", right: "20%", width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 10px 24px rgba(143,212,119,0.1)" }} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1, y: [0, -7, 0], rotate: [0, 4, 0] }} transition={{ opacity: { duration: 0.7, delay: 1.3 }, scale: { duration: 0.7, delay: 1.3 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 } }}>
        <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      {/* Floating star decorations — mobile */}
      <motion.div aria-hidden="true" className="absolute pointer-events-none flex md:hidden items-center justify-center" style={{ top: "5%", right: "20%", width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 6px 16px rgba(143,212,119,0.1)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, -6, 0], rotate: [0, -4, 0] }} transition={{ opacity: { duration: 0.6, delay: 1.45 }, scale: { duration: 0.6, delay: 1.45 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 } }}>
        <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none hidden md:flex items-center justify-center" style={{ top: "22%", left: "7%", width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 6px 14px rgba(143,212,119,0.08)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, 6, 0], rotate: [0, 4, 0] }} transition={{ opacity: { duration: 0.6, delay: 1.6 }, scale: { duration: 0.6, delay: 1.6 }, y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 }, rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 } }}>
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>
      <motion.div aria-hidden="true" className="absolute pointer-events-none flex md:hidden items-center justify-center" style={{ bottom: "8%", right: "12%", width: "30px", height: "30px", borderRadius: "9px", background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)", boxShadow: "0 6px 14px rgba(143,212,119,0.08)" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, -5, 0], rotate: [0, -3, 0] }} transition={{ opacity: { duration: 0.6, delay: 1.75 }, scale: { duration: 0.6, delay: 1.75 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 } }}>
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
          <h1 className="text-[#002a38]" style={{ fontSize: "clamp(1.375rem, 3vw, 1.875rem)", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            {t("hero.guest.headline1")}{" "}
            <span className="relative inline-block px-1.5">
              <span className="absolute bg-[#B0E89F] rounded-md -skew-x-2" style={{ top: "15%", bottom: "3%", left: "-1%", right: "-1%" }} />
              <span className="relative">{t("hero.guest.headline2")}</span>
            </span>{" "}
            {t("hero.guest.headline3")}
          </h1>
        </motion.div>

        {/* Tab bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex justify-center mb-5">
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
            {(["A", "B"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab ? "bg-[#002a38] text-white shadow-sm" : "text-gray-500 hover:text-[#002a38]"
                }`}
              >
                {tab === "A" ? "Variant A" : "Variant B"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          {activeTab === "A" ? <VariantAPanel key="A" /> : <VariantBPanel key="B" />}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Shared Voucher Picker Modal ─── */
interface VoucherPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIndex: number;
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
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-200 rounded-full" />
              <h3 className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
                აირჩიე სასურველი ვაუჩერი
              </h3>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 overflow-y-auto pb-[env(safe-area-inset-bottom)] max-h-[29rem] sm:max-h-[38rem]">
              {vouchers.map((v, i) => {
                const isSel = selectedIndex === i;
                return (
                  <button key={v.id} onClick={() => { onSelect(i); onClose(); }} className="group text-left">
                    <div
                      className={`relative bg-white rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200 ${isSel ? "shadow-md shadow-[#0068ff]/20" : "hover:shadow-sm hover:-translate-y-0.5"}`}
                      style={{ border: `1.5px solid ${isSel ? "#0068ff" : "#e5e7eb"}` }}
                    >
                      <div className="relative overflow-hidden bg-gray-50 aspect-[5/3]">
                        <ImageWithFallback src={v.image} alt={t(`vouchers.cards.${v.translationKey}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {isSel && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0068ff] flex items-center justify-center shadow-md">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 flex flex-col flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-2.5 h-2.5 text-gray-300 shrink-0" />
                          <span className="text-gray-400" style={{ fontSize: "0.5625rem", fontWeight: 500 }}>{t(`vouchers.cards.${v.translationKey}.expiry`)}</span>
                        </div>
                        <h4 className="text-[#002a38] mb-0.5" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{t(`vouchers.cards.${v.translationKey}.name`)}</h4>
                        <p className="text-gray-400 mb-2" style={{ fontSize: "0.625rem", lineHeight: 1.4 }}>{t(`vouchers.cards.${v.translationKey}.desc`)}</p>
                        <div className="flex items-center gap-1 mt-auto">
                          <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
                          <span className="text-[#002a38]" style={{ fontSize: "0.75rem", fontWeight: 700 }}>{v.stars}</span>
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
function usePurchaseFlow(selectedIndex: number) {
  const { user, purchaseVoucher } = useAuth();
  const { t } = useLanguage();
  const selected = vouchers[selectedIndex];
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, voucherId: "", name: "", stars: 0 });
  const [successModal, setSuccessModal] = useState({ isOpen: false, name: "", code: "", image: "", expiry: "" });

  const openConfirm = () =>
    setConfirmModal({ isOpen: true, voucherId: selected.id, name: t(`vouchers.cards.${selected.translationKey}.name`), stars: selected.stars });

  const handleConfirm = () => {
    const { voucherId, name, stars } = confirmModal;
    setConfirmModal((p) => ({ ...p, isOpen: false }));
    setIsPurchasing(true);
    setTimeout(() => {
      const result = purchaseVoucher(voucherId, name, stars);
      if (result.success) {
        setSuccessModal({ isOpen: true, name, code: result.voucherCode!, image: selected.image, expiry: t(`vouchers.cards.${selected.translationKey}.expiry`) });
      } else {
        toast.error(result.message);
      }
      setIsPurchasing(false);
    }, 1200);
  };

  return { isPurchasing, confirmModal, setConfirmModal, successModal, setSuccessModal, openConfirm, handleConfirm, user };
}

/* ─── Variant A: Single card with inline promo boost ─── */
function VariantAPanel() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [starInput, setStarInput] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  // Inline promo code state
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState<number | null>(null);

  const { isPurchasing, confirmModal, setConfirmModal, successModal, setSuccessModal, openConfirm, handleConfirm, user } = usePurchaseFlow(selectedIndex);
  const { redeemPromoCode } = useAuth();

  const selected = vouchers[selectedIndex];
  const typedAmount = parseInt(starInput, 10);
  const amountMatches = !isNaN(typedAmount) && typedAmount === selected.stars;

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
        setTimeout(() => { setPromoSuccess(null); setPromoOpen(false); }, 2500);
      } else {
        setPromoError(result.message);
      }
      setIsRedeeming(false);
    }, 800);
  };

  const handleExchange = () => {
    if (!isAuthenticated) { setAuthMode("register"); setShowAuth(true); return; }
    openConfirm();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm lg:mx-auto"
        style={{ maxWidth: "var(--size-2col-span, 100%)" }}
      >
        {/* SELL */}
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400" style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em" }}>{t("hero.swap.sell")}</p>
            {isAuthenticated && user && (
              <p className="text-gray-400 flex items-center gap-1" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>
                {t("hero.swap.balance")}: <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" /> <span className="text-[#002a38]">{user.stars}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DCEFD2] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-[#3FA62E] fill-[#3FA62E]" />
            </div>
            <input
              type="number" min="1" value={starInput} onChange={(e) => setStarInput(e.target.value)}
              placeholder="e.g. 15, 20, 25"
              className="flex-1 bg-transparent text-[#002a38] placeholder:text-gray-300 focus:outline-none"
              style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "0.06em" }}
            />
          </div>
          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[...new Set(vouchers.map((v) => v.stars))].map((amt) => (
              <button key={amt} onClick={() => setStarInput(String(amt))}
                className={`flex items-center gap-1 px-3 py-1 rounded-full border font-semibold transition-all duration-150 ${starInput === String(amt) ? "bg-[#DCEFD2] border-[#3FA62E] text-[#002a38]" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#3FA62E] hover:text-[#002a38]"}`}
                style={{ fontSize: "0.8125rem" }}
              >
                <Star className={`w-3 h-3 ${starInput === String(amt) ? "text-[#3FA62E] fill-[#3FA62E]" : "text-gray-400"}`} />
                {amt}
              </button>
            ))}
          </div>

          {/* Inline promo code boost */}
          <div className="mt-3 border-t border-gray-50 pt-3">
            <AnimatePresence mode="wait">
              {promoSuccess !== null ? (
                <motion.div key="success" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-2 bg-[#f0fdf4] rounded-xl border border-[#86efac]">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-green-700" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>+{promoSuccess} stars added!</span>
                </motion.div>
              ) : promoOpen ? (
                <motion.div key="open" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="flex gap-2">
                    <input
                      type="text" value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      placeholder={t("hero.auth.promoPlaceholder")} autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[#002a38] placeholder:text-gray-300 focus:outline-none focus:border-[#0068ff] transition-colors"
                      style={{ fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.05em" }}
                    />
                    <button onClick={handleApplyPromo} disabled={isRedeeming || !promoInput.trim()}
                      className="px-4 py-2 bg-[#002a38] text-white rounded-xl hover:bg-[#003a50] disabled:opacity-50 transition-colors shrink-0"
                      style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                      {isRedeeming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("hero.swap.redeemBtn")}
                    </button>
                    <button onClick={() => { setPromoOpen(false); setPromoInput(""); setPromoError(""); }}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  {promoError && <p className="mt-1.5 text-red-500" style={{ fontSize: "0.75rem" }}>{promoError}</p>}
                </motion.div>
              ) : (
                <motion.button key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setPromoOpen(true)}
                  className="flex items-center gap-1.5 text-[#0068ff] hover:text-[#0050cc] transition-colors"
                  style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                  <Plus className="w-3.5 h-3.5" />
                  Enter promo code
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div className="relative mx-5">
          <div className="border-t border-gray-100" />
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        {/* BUY */}
        <div className="p-5 pt-6 pb-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em" }}>{t("hero.swap.buy")}</p>
          <button onClick={() => setPickerOpen(true)} className="w-full flex items-center justify-between gap-3 hover:bg-gray-50 rounded-xl px-2 py-1.5 -mx-2 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <ImageWithFallback src={selected.image} alt={t(`vouchers.cards.${selected.translationKey}.name`)} className="w-full h-full object-cover" />
              </div>
              <span className="text-[#002a38] truncate" style={{ fontWeight: 700, fontSize: "1rem" }}>{t(`vouchers.cards.${selected.translationKey}.name`)}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-[#e6f0ff] rounded-full px-3 py-1">
                <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
                <span className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 800 }}>{selected.stars}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          <AnimatePresence>
            {starInput && !isNaN(typedAmount) && !amountMatches && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-amber-500" style={{ fontSize: "0.75rem" }}>
                This voucher costs {selected.stars} ★, you entered {typedAmount}.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Exchange button */}
        <div className="px-5 pb-5">
          <button onClick={handleExchange} disabled={isPurchasing || !starInput || !amountMatches}
            className="w-full py-4 bg-[#002a38] text-white rounded-2xl hover:bg-[#003a50] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            {isPurchasing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("hero.swap.exchangeBtn")}
          </button>
        </div>
      </motion.div>

      <VoucherPickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
      <PurchaseConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal((p) => ({ ...p, isOpen: false }))} onConfirm={handleConfirm} voucherName={confirmModal.name} voucherStars={confirmModal.stars} currentStars={user?.stars ?? 0} isLoading={isPurchasing} voucherId={confirmModal.voucherId} />
      <PurchaseSuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal((p) => ({ ...p, isOpen: false }))} voucherName={successModal.name} voucherCode={successModal.code} voucherImage={successModal.image} expiryText={successModal.expiry} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} mode={authMode} onSwitchMode={(mode) => setAuthMode(mode)} />
    </>
  );
}

/* ─── Variant B: Triple-chain (Promo → Stars → Voucher) ─── */
function VariantBPanel() {
  const { isAuthenticated, redeemPromoCode } = useAuth();
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  const [promoOpen, setPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState<number | null>(null);

  const { isPurchasing, confirmModal, setConfirmModal, successModal, setSuccessModal, openConfirm, handleConfirm, user } = usePurchaseFlow(selectedIndex);

  const selected = vouchers[selectedIndex];
  const stars = user?.stars ?? 0;
  const canAfford = isAuthenticated && stars >= selected.stars;

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
        setTimeout(() => { setPromoSuccess(null); setPromoOpen(false); }, 2500);
      } else {
        setPromoError(result.message);
      }
      setIsRedeeming(false);
    }, 800);
  };

  const handleExchange = () => {
    if (!isAuthenticated) { setAuthMode("register"); setShowAuth(true); return; }
    openConfirm();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
        className="flex flex-col gap-0 lg:mx-auto"
        style={{ maxWidth: "var(--size-2col-span, 100%)" }}
      >
        {/* Card 1: Promo code (optional) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <AnimatePresence mode="wait">
            {promoSuccess !== null ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-green-700" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>+{promoSuccess} stars added!</p>
                  <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Balance updated</p>
                </div>
              </motion.div>
            ) : promoOpen ? (
              <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400" style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em" }}>{t("hero.swap.redeemInput")}</p>
                  <button onClick={() => { setPromoOpen(false); setPromoInput(""); setPromoError(""); }}
                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text" value={promoInput} onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                    placeholder={t("hero.auth.promoPlaceholder")} autoFocus onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    className="flex-1 bg-transparent text-[#002a38] placeholder:text-gray-300 focus:outline-none"
                    style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "0.06em" }}
                  />
                  <button onClick={handleApplyPromo} disabled={isRedeeming || !promoInput.trim()}
                    className="px-4 py-2 bg-[#002a38] text-white rounded-xl hover:bg-[#003a50] disabled:opacity-50 transition-colors shrink-0"
                    style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                    {isRedeeming ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("hero.swap.redeemBtn")}
                  </button>
                </div>
                {promoError && <p className="mt-2 text-red-500" style={{ fontSize: "0.75rem" }}>{promoError}</p>}
              </motion.div>
            ) : (
              <motion.button key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setPromoOpen(true)} className="w-full flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#e6f0ff] flex items-center justify-center shrink-0 transition-colors">
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#0068ff] transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Have a promo code?</p>
                    <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>Tap to add stars to your balance</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0068ff] transition-colors" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Connector */}
        <div className="flex justify-center py-1">
          <div className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <ArrowDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        {/* Card 2: Stars balance */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em" }}>{t("hero.swap.sell")}</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DCEFD2] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-[#3FA62E] fill-[#3FA62E]" />
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.span key={stars} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  className="text-[#002a38] block" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {isAuthenticated ? stars : "–"}
                </motion.span>
              </AnimatePresence>
              <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                {isAuthenticated ? t("hero.swap.balance") : "Login to see your balance"}
              </span>
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center py-1">
          <div className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
            <ArrowDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>

        {/* Card 3: Voucher selector */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.07em" }}>{t("hero.swap.buy")}</p>
          <button onClick={() => setPickerOpen(true)} className="w-full flex items-center justify-between gap-3 hover:bg-gray-50 rounded-xl px-2 py-1.5 -mx-2 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <ImageWithFallback src={selected.image} alt={t(`vouchers.cards.${selected.translationKey}.name`)} className="w-full h-full object-cover" />
              </div>
              <span className="text-[#002a38] truncate" style={{ fontWeight: 700, fontSize: "1rem" }}>{t(`vouchers.cards.${selected.translationKey}.name`)}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-[#e6f0ff] rounded-full px-3 py-1">
                <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
                <span className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 800 }}>{selected.stars}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          <AnimatePresence>
            {isAuthenticated && !canAfford && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-amber-500" style={{ fontSize: "0.75rem" }}>
                Need {selected.stars - stars} more ★ for this voucher
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Exchange button */}
        <div className="mt-3">
          <button onClick={handleExchange} disabled={isPurchasing || (isAuthenticated && !canAfford)}
            className="w-full py-4 bg-[#002a38] text-white rounded-2xl hover:bg-[#003a50] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
            {isPurchasing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t("hero.swap.exchangeBtn")}
          </button>
        </div>
      </motion.div>

      <VoucherPickerModal isOpen={pickerOpen} onClose={() => setPickerOpen(false)} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
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
