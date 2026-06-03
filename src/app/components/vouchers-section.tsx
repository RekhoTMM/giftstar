import { useState, useEffect } from "react";
import { Star, Sparkles, Info, Check, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "./auth-context";
import { useNavigate } from "react-router";
import { PurchaseConfirmationModal } from "./purchase-confirmation-modal";
import { PurchaseSuccessModal } from "./purchase-success-modal";
import { MysteryBoxAnimation } from "./mystery-box-animation";
import { AuthModal } from "./auth-modal";
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

interface VouchersSectionProps {
  selectedVoucherIndex: number | null;
  onSelectVoucher: (index: number | null) => void;
}

export function VouchersSection({ selectedVoucherIndex, onSelectVoucher }: VouchersSectionProps) {
  const { isAuthenticated, user, purchaseVoucher, addStars } = useAuth();
  const navigate = useNavigate();
  const { t, tArray } = useLanguage();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [justPurchasedId, setJustPurchasedId] = useState<string | null>(null);
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

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    voucherId: string;
    name: string;
    stars: number;
  }>({ isOpen: false, voucherId: "", name: "", stars: 0 });

  // Auth modal state
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  // Purchase success modal state
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    name: string;
    code: string;
    image: string;
    expiry: string;
  }>({ isOpen: false, name: "", code: "", image: "", expiry: "" });

  // Mystery BOX animation state
  const [mysteryBoxOpen, setMysteryBoxOpen] = useState(false);
  const [mysteryBoxPurchased, setMysteryBoxPurchased] = useState(false);
  const [pendingPrize, setPendingPrize] = useState<any>(null);

  const openConfirmModal = (voucherId: string, name: string, stars: number) => {
    if (!isAuthenticated) {
      setAuthMode("register");
      setShowAuth(true);
      return;
    }
    setConfirmModal({ isOpen: true, voucherId, name, stars });
  };

  const handleConfirmPurchase = () => {
    const { voucherId, name, stars } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    if (voucherId.startsWith("mysteryBox")) {
      // Deduct stars first, then show animation
      setPurchasingId(voucherId);
      setTimeout(() => {
        const result = purchaseVoucher(voucherId, name, stars);
        if (result.success) {
          setMysteryBoxPurchased(true);
          setMysteryBoxOpen(true);
        } else {
          toast.error(result.message);
        }
        setPurchasingId(null);
      }, 600);
      return;
    }

    // Regular voucher purchase
    setPurchasingId(voucherId);
    setTimeout(() => {
      const result = purchaseVoucher(voucherId, name, stars);
      if (result.success) {
        const voucherData = vouchers.find((v) => v.id === voucherId);
        setSuccessModal({
          isOpen: true,
          name,
          code: result.voucherCode!,
          image: voucherData?.image || "",
          expiry: voucherData ? t(`vouchers.cards.${voucherData.translationKey}.expiry`) : "",
        });
        setJustPurchasedId(voucherId);
        setTimeout(() => setJustPurchasedId(null), 2500);
      } else {
        toast.error(result.message);
      }
      setPurchasingId(null);
    }, 1200);
  };

  const handleMysteryBoxClose = () => {
    setMysteryBoxOpen(false);
    setMysteryBoxPurchased(false);
    // Show toast after modal closes so it's visible
    if (pendingPrize) {
      const prize = pendingPrize;
      setPendingPrize(null);
      setTimeout(() => {
        if (prize.starsWon && prize.starsWon > 0) {
          toast.success(`${t("mysteryBox.bonusStars").replace("{count}", String(prize.starsWon))} 🌟`, {
            icon: <Star className="w-5 h-5 text-[#3FA62E] fill-[#3FA62E]" />,
          });
        } else {
          toast.success(`${t("mysteryBox.wonPrize").replace("{name}", t(`mysteryBox.prizes.${prize.id}.name`))} 🎉`);
        }
      }, 300);
    }
  };

  const handlePrizeRevealed = (prize: any) => {
    // If prize has bonus stars, add them immediately
    if (prize.starsWon && prize.starsWon > 0) {
      addStars(prize.starsWon);
    }
    // Store prize to show toast on close
    setPendingPrize(prize);
  };

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

        {/* Voucher Cards */}
        <div className="voucher-cards-grid flex flex-wrap mb-4" style={{ width: "100%", gap: "var(--size-card-gap)" }}>
          {vouchers.map((voucher, i) => {
            const canAfford = isAuthenticated && user ? user.stars >= voucher.stars : false;
            const isPurchasing = purchasingId === voucher.id;
            const justPurchased = justPurchasedId === voucher.id;
            return (
              <motion.div
                key={voucher.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="voucher-card-wrapper group cursor-pointer"
                style={{ width: "var(--voucher-card-width)" }}
                onClick={() => {
                  if (isPurchasing || justPurchased) return;
                  if (!isAuthenticated) {
                    setAuthMode("register");
                    setShowAuth(true);
                    return;
                  }
                  onSelectVoucher(i);
                  toast.success(`${t(`vouchers.cards.${voucher.translationKey}.name`)} არჩეულია`, {
                    icon: <Check className="w-4 h-4 text-green-500" />,
                  });
                  const target = document.getElementById("hero-voucher-picker");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
              >
                <div className={`voucher-card rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full p-[1px] ${selectedVoucherIndex === i ? "shadow-md shadow-[#0068ff]/20" : ""}`} style={{ background: selectedVoucherIndex === i ? "#0068ff" : "#e5e7eb" }}>
                <div className="relative bg-white rounded-[calc(1rem-1px)] overflow-hidden flex flex-col h-full">
                  {/* Info trigger — prize strip for Mystery BOX, info icon for others */}
                  {voucher.id.startsWith("mysteryBox") ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoVoucher(voucher);
                      }}
                      className="absolute top-2 right-2 h-8 flex items-center bg-white/90 rounded-full px-1.5 hover:bg-white transition-colors z-10"
                    >
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
                      <Info className="w-4.5 h-4.5 text-gray-600 ml-1.5 flex-shrink-0" />
                    </button>
                  ) : !voucher.id.startsWith("mysteryBox") ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoVoucher(voucher);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors z-10"
                    >
                      <Info className="w-4.5 h-4.5 text-gray-600" />
                    </button>
                  ) : null}
                  {/* Image */}
                  <div className="voucher-card-image relative overflow-hidden bg-gray-50 aspect-[5/3]">
                    <ImageWithFallback
                      src={voucher.image}
                      alt={t(`vouchers.cards.${voucher.translationKey}.name`)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Purchase overlay */}
                    <AnimatePresence>
                      {justPurchased && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#0068ff]/80 flex items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                          >
                            <Check className="w-6 h-6 text-[#0068ff]" />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="voucher-card-content p-3.5 flex flex-col flex-1">
                    <div className="voucher-card-expiry flex items-center gap-1 mb-1.5">
                      <Clock className="w-3 h-3 text-gray-300 shrink-0" />
                      <span className="text-gray-400" style={{ fontSize: "0.625rem", fontWeight: 500 }}>
                        {t(`vouchers.cards.${voucher.translationKey}.expiry`)}
                      </span>
                    </div>
                    <h3
                      className="text-[#002a38] mb-1"
                      style={{ fontSize: "0.9375rem", fontWeight: 700 }}
                    >
                      {t(`vouchers.cards.${voucher.translationKey}.name`)}
                    </h3>
                    <p
                      className="text-gray-400 mb-3"
                      style={{ fontSize: "0.6875rem", lineHeight: 1.5 }}
                    >
                      {t(`vouchers.cards.${voucher.translationKey}.desc`)}
                    </p>
                    <div className="voucher-card-footer flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
                        <span className="text-[#002a38]" style={{ fontSize: "0.8125rem", fontWeight: 700 }}>
                          {voucher.stars}
                        </span>
                      </div>
                      <div
                        className={`rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ${
                          selectedVoucherIndex === i
                            ? "bg-[#0068ff]"
                            : "bg-[#e6f0ff] group-hover:bg-[#0068ff]"
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 transition-colors duration-200 ${
                            selectedVoucherIndex === i
                              ? "text-white"
                              : "text-[#0068ff] group-hover:text-white"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </motion.div>
            );
          })}
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

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmPurchase}
        voucherName={confirmModal.name}
        voucherStars={confirmModal.stars}
        currentStars={user?.stars ?? 0}
        isLoading={!!purchasingId}
        voucherId={confirmModal.voucherId}
      />

      {/* Mystery BOX Animation */}
      <MysteryBoxAnimation
        isOpen={mysteryBoxOpen}
        onClose={handleMysteryBoxClose}
        onPrizeRevealed={handlePrizeRevealed}
      />

      {/* Voucher Info Modal */}
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
              className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
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
                {/* Star cost */}
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
                  <span className="text-[#002a38]" style={{ fontSize: "0.8125rem", fontWeight: 700 }}>
                    {infoVoucher.stars}
                  </span>
                </div>
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
                <ul className="space-y-2 mb-5">
                  {tArray(`vouchers.cards.${infoVoucher.translationKey}.details`).map((item, i) => (
                    <li key={i} className="flex gap-2 text-gray-500" style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}>
                      <span className="text-[#0068ff] mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Sticky CTA */}
              <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  onClick={() => {
                    const voucher = infoVoucher;
                    setInfoVoucher(null);
                    openConfirmModal(voucher.id, t(`vouchers.cards.${voucher.translationKey}.name`), voucher.stars);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all flex items-center justify-center gap-2"
                  style={{ fontWeight: 600, fontSize: "1rem" }}
                >
                  {t("vouchers.exchange")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />

      <PurchaseSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        voucherName={successModal.name}
        voucherCode={successModal.code}
        voucherImage={successModal.image}
        expiryText={successModal.expiry}
      />
    </>
  );
}