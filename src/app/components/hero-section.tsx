import { useState } from "react";
import { Star, Sparkles, Gift, Check } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import { useLanguage } from "../../i18n/language-context";


interface HeroSectionProps {
  onRegister: () => void;
}

export function HeroSection({ onRegister }: HeroSectionProps) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AuthenticatedHero /> : <GuestHero onRegister={onRegister} />;
}

/* ─── Authenticated Hero: Promo Code Entry ─── */
function AuthenticatedHero() {
  const { user, redeemPromoCode } = useAuth();
  const { t } = useLanguage();
  const [promoInput, setPromoInput] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  if (!user) return null;

  const handleRedeemPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsRedeeming(true);
    setTimeout(() => {
      const result = redeemPromoCode(promoInput);
      if (result.success) {
        toast.success(result.message, {
          icon: <Star className="w-5 h-5 text-[#3FA62E] fill-[#3FA62E]" />,
        });
        setRedeemSuccess(true);
        setPromoInput("");
        setTimeout(() => setRedeemSuccess(false), 3000);
      } else {
        toast.error(result.message);
      }
      setIsRedeeming(false);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #f0f5ff 0%, rgba(214,230,255,0.3) 50%, transparent 100%)", width: "100%" }}>
      {/* Floating star shapes — same as guest hero */}
      {/* Bottom-left — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          bottom: "10%",
          left: "12%",
          width: "76px",
          height: "76px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 14px 40px rgba(143, 212, 119, 0.12)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.0 },
          scale: { duration: 0.7, delay: 1.0 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
        }}
      >
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Top-right — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "8%",
          right: "5%",
          width: "76px",
          height: "76px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 10px 28px rgba(143, 212, 119, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, 8, 0], rotate: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.15 },
          scale: { duration: 0.7, delay: 1.15 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 },
        }}
      >
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Near CTA — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "62%",
          right: "20%",
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 10px 24px rgba(143, 212, 119, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0], rotate: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.3 },
          scale: { duration: 0.7, delay: 1.3 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 },
        }}
      >
        <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, top-left — mobile only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none flex md:hidden items-center justify-center"
        style={{
          top: "12%",
          left: "5%",
          width: "32px",
          height: "32px",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 16px rgba(143, 212, 119, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0], rotate: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.45 },
          scale: { duration: 0.6, delay: 1.45 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 },
          rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 },
        }}
      >
        <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, top-left — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "22%",
          left: "7%",
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 14px rgba(143, 212, 119, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, 6, 0], rotate: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.6 },
          scale: { duration: 0.6, delay: 1.6 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 },
          rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 },
        }}
      >
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, mid-right — mobile only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none flex md:hidden items-center justify-center"
        style={{
          top: "24%",
          right: "8%",
          width: "30px",
          height: "30px",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 14px rgba(143, 212, 119, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0], rotate: [0, 5, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.7 },
          scale: { duration: 0.6, delay: 1.7 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.35 },
          rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.35 },
        }}
      >
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, bottom-center — mobile only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none flex md:hidden items-center justify-center"
        style={{
          bottom: "2%",
          left: "30%",
          width: "30px",
          height: "30px",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 14px rgba(143, 212, 119, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0], rotate: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.75 },
          scale: { duration: 0.6, delay: 1.75 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
        }}
      >
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      <div className="relative z-10 px-5" style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", paddingTop: "var(--space-hero-pt)", paddingBottom: "var(--space-hero-pb)" }}>
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <p className="text-gray-400" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
            {t("hero.auth.greeting")}
          </p>
          <h1 className="text-[#002a38]" style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            {user.firstName} {user.lastName}
          </h1>
        </motion.div>

        {/* Promo Code Entry Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm lg:mx-auto"
          style={{ maxWidth: "var(--size-2col-span, 100%)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#e6f0ff] flex items-center justify-center">
              <Gift className="w-5.5 h-5.5 text-[#0068ff]" />
            </div>
            <div>
              <h2 className="text-[#002a38]" style={{ fontSize: "1.0625rem", fontWeight: 700 }}>
                {t("hero.auth.promoTitle")}
              </h2>
            </div>
          </div>

          <form onSubmit={handleRedeemPromo} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder={t("hero.auth.promoPlaceholder")}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all placeholder:text-gray-400 tracking-widest text-center"
                style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "0.1em" }}
              />
            </div>
            <button
              type="submit"
              disabled={isRedeeming || !promoInput.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontWeight: 600, fontSize: "0.9375rem" }}
            >
              {isRedeeming ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : redeemSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  {t("hero.auth.activated")}
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5" />
                  {t("hero.auth.activateCode")}
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </section>
  );
}

/* ─── Guest Hero: Marketing Content ─── */
function GuestHero({ onRegister }: { onRegister: () => void }) {
  const { t } = useLanguage();

  return (
    <section
      className="hero-section-guest relative overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #f0f5ff 0%, rgba(214,230,255,0.3) 50%, transparent 100%)", width: "100%" }}
    >
      {/* Floating star shapes — Stripey-inspired green gradient blobs with star icons */}
      {/* Large, top-left, bleeds off-edge — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          bottom: "10%",
          left: "12%",
          width: "76px",
          height: "76px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 14px 40px rgba(143, 212, 119, 0.12)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0], rotate: [0, 2, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.0 },
          scale: { duration: 0.7, delay: 1.0 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.7 },
        }}
      >
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Medium, top-right — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "8%",
          right: "5%",
          width: "76px",
          height: "76px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 10px 28px rgba(143, 212, 119, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, 8, 0], rotate: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.15 },
          scale: { duration: 0.7, delay: 1.15 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.85 },
        }}
      >
        <Star className="w-7 h-7 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Medium, near CTA button — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "62%",
          right: "20%",
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 10px 24px rgba(143, 212, 119, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1, y: [0, -7, 0], rotate: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.7, delay: 1.3 },
          scale: { duration: 0.7, delay: 1.3 },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.0 },
        }}
      >
        <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, top-right area — visible on mobile */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none flex md:hidden items-center justify-center"
        style={{
          top: "5%",
          right: "20%",
          width: "32px",
          height: "32px",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 16px rgba(143, 212, 119, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0], rotate: [0, -4, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.45 },
          scale: { duration: 0.6, delay: 1.45 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 },
          rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.1 },
        }}
      >
        <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, top-left near headline — desktop only */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none hidden md:flex items-center justify-center"
        style={{
          top: "22%",
          left: "7%",
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 14px rgba(143, 212, 119, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, 6, 0], rotate: [0, 4, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.6 },
          scale: { duration: 0.6, delay: 1.6 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 },
          rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.25 },
        }}
      >
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* Small, mid-left near "სასურველ" — visible on mobile */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none flex md:hidden items-center justify-center"
        style={{
          top: "38%",
          left: "5%",
          width: "30px",
          height: "30px",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 14px rgba(143, 212, 119, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0], rotate: [0, 5, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.7 },
          scale: { duration: 0.6, delay: 1.7 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.35 },
          rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.35 },
        }}
      >
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      {/* NEW: Small, bottom — visible on mobile */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none flex md:hidden items-center justify-center"
        style={{
          bottom: "8%",
          right: "12%",
          width: "30px",
          height: "30px",
          borderRadius: "9px",
          background: "linear-gradient(135deg, #DCEFD2 0%, #B0E89F 100%)",
          boxShadow: "0 6px 14px rgba(143, 212, 119, 0.08)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -5, 0], rotate: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.75 },
          scale: { duration: 0.6, delay: 1.75 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 },
        }}
      >
        <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
      </motion.div>

      <div className="hero-content relative z-10 flex flex-col items-center" style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", padding: "var(--space-hero-pt) var(--space-lg) var(--space-hero-pb)" }}>
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="hero-headline text-center mb-5 flex flex-col items-center"
        >
          <h1
            className="text-[#002a38] mb-4 lg:mb-6"
            style={{ fontSize: "clamp(2.25rem, 4vw, 3rem)", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.02em" }}
          >
            {t("hero.guest.headline1")}{" "}
            <span className="relative inline-block px-2">
              <span className="absolute bg-[#B0E89F] rounded-lg -skew-x-2" style={{ top: "15%", bottom: "3%", left: "-1%", right: "-1%" }} />
              <span className="relative">{t("hero.guest.headline2")}</span>
            </span>{" "}
            {t("hero.guest.headline3")}
          </h1>
          <p
            className="text-gray-500 max-w-xs lg:max-w-md"
            style={{ fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)", lineHeight: 1.65 }}
          >
            {t("hero.guest.subtitle")}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="hero-cta flex justify-center mb-5"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={onRegister}
            className="hero-cta-button px-10 py-4 lg:px-12 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-full shadow-lg shadow-[#0068ff]/20 flex items-center gap-2.5 hover:shadow-xl hover:shadow-[#0068ff]/30 transition-all duration-200"
            style={{ fontWeight: 600, fontSize: "1.0625rem" }}
          >
            {t("hero.guest.cta")}
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}

/* ─── Mock activation timestamps (simulate codes activated at staggered times) ─── */
const MOCK_ACTIVATION_TIMES: Record<string, number> = {};
function getActivationTime(code: string): number {
  if (!MOCK_ACTIVATION_TIMES[code]) {
    const existingCount = Object.keys(MOCK_ACTIVATION_TIMES).length;
    const hoursAgo = 2 + existingCount * 6; // 2h, 8h, 14h, 20h, 26h ago
    MOCK_ACTIVATION_TIMES[code] = Date.now() - hoursAgo * 60 * 60 * 1000;
  }
  return MOCK_ACTIVATION_TIMES[code];
}

const PROMO_STARS: Record<string, number> = {
  GIFT10: 10, STAR20: 20, PROMO5: 5, BONUS15: 15, VIP50: 50,
};

/* ─── Promo Code Badge ─── */
export function PromoCodeWithExpiry({ code, variant = "default" }: { code: string; variant?: "default" | "light" }) {
  const starsValue = PROMO_STARS[code] ?? "?";
  const isLight = variant === "light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl ${
        isLight
          ? "bg-white/10 border border-white/10"
          : "bg-[#f9fafb] border border-gray-100"
      }`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-green-100"
      >
        <Check className="w-4 h-4 text-green-600" />
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span
          className={`tracking-wider ${isLight ? "text-white" : "text-[#002a38]"}`}
          style={{ fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.06em" }}
        >
          {code}
        </span>
        <div className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 ${
          isLight ? "bg-white/15" : "bg-[#e6f0ff]"
        }`}>
          <Star className={`w-3 h-3 ${isLight ? "text-[#B0E89F] fill-[#B0E89F]" : "text-[#3FA62E] fill-[#3FA62E]"}`} />
          <span
            className={isLight ? "text-white" : "text-[#0068ff]"}
            style={{ fontSize: "0.625rem", fontWeight: 700 }}
          >
            +{starsValue}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
