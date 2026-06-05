import { useState } from "react";
import { Users, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { AuthModal } from "./auth-modal";
import { HeroSection } from "./hero-section";
import { VouchersSection } from "./vouchers-section";
import { useAuth } from "./auth-context";
import { useLanguage } from "../../i18n/language-context";
import { toast } from "sonner";

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const { t, tArray } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [selectedVoucherIndex, setSelectedVoucherIndex] = useState<number | null>(null);

  const openRegister = () => {
    setAuthMode("register");
    setShowAuth(true);
  };

  const faqs = tArray("faq.items") as { q: string; a: string }[];

  return (
    <>
      {/* New Hero Section */}
      <HeroSection onRegister={openRegister} selectedVoucherIndex={selectedVoucherIndex} onSelectVoucher={setSelectedVoucherIndex} />

      <div style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", width: "100%" }}>

        {/* Invite Friend Section — shown right below the hero when authenticated */}
        {isAuthenticated && user && (
          <section className="px-5" style={{ width: "100%", paddingTop: "var(--space-2xl)", paddingBottom: "80px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] py-14 px-8 lg:px-12 relative overflow-hidden border border-green-100/60 flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-12 w-full"
              style={{
                background: "linear-gradient(to bottom, #DCEFD2 0%, #e8f5e0 30%, #f2faf0 55%, #ffffff 100%)",
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none bg-[radial-gradient(circle,rgba(63,166,46,0.15)_0%,transparent_70%)]" />

              {/* Left: Icon */}
              <div className="relative z-10 flex justify-center lg:justify-start lg:pl-4 mb-8 lg:mb-0 lg:shrink-0">
                <div className="relative w-28 h-28">
                  <div className="w-full h-full rounded-full bg-white/80 backdrop-blur-sm shadow-lg shadow-[#0068ff]/20/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#B0E89F] flex items-center justify-center shadow-md shadow-green-300/30">
                      <Users className="w-7 h-7 text-[#1a6b0f]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
                <h2
                  className="text-[#002a38] mb-3"
                  style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em" }}
                >
                  {t("invite.title")}<br />{t("invite.titleSuffix")}
                </h2>
                <p
                  className="text-gray-500 mb-6 max-w-[280px] lg:max-w-none"
                  style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
                >
                  {t("invite.subtitle")}
                </p>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm border border-[#0068ff]/10 max-w-[280px] lg:max-w-sm w-full mb-6">
                  <p className="text-gray-400 mb-2" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>
                    {t("invite.referralLabel")}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="text-[#0068ff] tracking-wider"
                      style={{ fontSize: "1.125rem", fontWeight: 800, letterSpacing: "0.08em" }}
                    >
                      {user.referralCode}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode).catch(() => {});
                        setCopiedReferral(true);
                        toast.success(t("invite.referralCopied"));
                        setTimeout(() => setCopiedReferral(false), 2000);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        copiedReferral
                          ? "bg-green-100 text-green-600"
                          : "bg-[#e6f0ff] text-[#0068ff] hover:bg-[#d6e6ff]"
                      }`}
                    >
                      {copiedReferral ? (
                        <Check className="w-4.5 h-4.5" />
                      ) : (
                        <Copy className="w-4.5 h-4.5" />
                      )}
                    </motion.button>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => {
                    const text = `GiftMe.ge-ზე დარეგისტრირდი ჩემი კოდით: ${user.referralCode}, მიიღე 20 ვარსკვლავი და გადაცვალე სასურველ ვაუჩერში! ✨`;
                    navigator.clipboard.writeText(text).catch(() => {});
                    toast.success(`${t("invite.copiedToast")} "${text}"`);
                  }}
                  className="px-10 py-3.5 rounded-full text-[#1a6b0f] shadow-lg shadow-[#B0E89F]/40 hover:shadow-xl hover:shadow-[#B0E89F]/50 transition-all duration-200"
                  style={{
                    background: "#B0E89F",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {t("invite.cta")}
                </motion.button>
              </div>
            </motion.div>
          </section>
        )}

        {/* Invite Friend CTA — guest only, above FAQ */}
        {!isAuthenticated && (
          <section className="cta-section-guest" style={{ padding: "var(--space-2xl) var(--space-lg) 80px", width: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="cta-card rounded-[2.5rem] py-14 px-8 lg:px-12 overflow-hidden border border-green-100/60 flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-12 w-full"
              style={{
                background: "linear-gradient(to bottom, #DCEFD2 0%, #e8f5e0 30%, #f2faf0 55%, #ffffff 100%)",
              }}
            >
              {/* Left: Icon */}
              <div className="flex justify-center lg:justify-start lg:pl-4 mb-8 lg:mb-0 lg:shrink-0">
                <div className="relative w-28 h-28">
                  <div className="w-full h-full rounded-full bg-white/80 backdrop-blur-sm shadow-lg shadow-green-200/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#B0E89F] flex items-center justify-center shadow-md shadow-green-300/30">
                      <Users className="w-7 h-7 text-[#1a6b0f]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="cta-card-content flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
                <h2
                  className="text-[#002a38] mb-3"
                  style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em" }}
                >
                  {t("invite.title")}<br />{t("invite.titleSuffix")}
                </h2>
                <p
                  className="text-gray-500 mb-8 max-w-[280px] lg:max-w-none"
                  style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
                >
                  {t("invite.subtitle")}
                </p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={openRegister}
                  className="px-10 py-3.5 rounded-full text-[#1a6b0f] shadow-lg shadow-[#B0E89F]/40 hover:shadow-xl hover:shadow-[#B0E89F]/50 transition-all duration-200"
                  style={{
                    background: "#B0E89F",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {t("invite.cta")}
                </motion.button>
              </div>
            </motion.div>
          </section>
        )}
      </div>

      {/* Available Vouchers — informational showcase */}
      <VouchersSection />

      <div style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", width: "100%" }}>
        {/* FAQ */}
        <section className="faq-section flex flex-col lg:flex-row lg:gap-12 lg:items-start" style={{ padding: "0 var(--space-lg) 80px", width: "100%" }}>
          <div className="lg:w-1/3 lg:shrink-0 mb-6 lg:mb-0 lg:sticky lg:top-24">
            <h2 className="text-center lg:text-left text-[#002a38] mb-2" style={{ fontSize: '1.375rem', fontWeight: 800, width: "100%" }}>
              {t("faq.title")}
            </h2>
            <p className="text-center lg:text-left text-gray-400" style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}>
              {t("faq.subtitle")}
            </p>
          </div>
          <div className="faq-list flex flex-col" style={{ width: "100%", gap: "var(--space-md)" }}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="faq-item bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#0068ff]/20 hover:shadow-sm transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-[#002a38] pr-4" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {faq.q}
                  </span>
                  <div className="shrink-0 text-gray-400">
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-gray-500" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </>
  );
}
