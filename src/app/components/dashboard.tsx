import { useState, useEffect } from "react";
import { Star, Copy, Check, Users, Clock, History, ShoppingBag, User, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import { useNavigate, useLocation } from "react-router";
import { useLanguage } from "../../i18n/language-context";
import { PromoCodeWithExpiry } from "./hero-section";

export function Dashboard() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedVoucherIds, setCopiedVoucherIds] = useState<Set<string>>(new Set());
  const [showAllFriends, setShowAllFriends] = useState(false);
  const initialTab = (location.state as any)?.tab === "vouchers" ? "vouchers" : "invite";
  const [activeTab, setActiveTab] = useState<"invite" | "vouchers">(initialTab);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode).catch(() => {});
    setCopiedReferral(true);
    toast.success(t("dashboard.referralCopied"));
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const copyVoucherCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedVoucherIds((prev) => new Set(prev).add(id));
    toast.success(t("dashboard.voucherCopied"));
    setTimeout(() => {
      setCopiedVoucherIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ka-GE", { day: "numeric", month: "short", year: "numeric" });
  };

  const totalReferralStars = user.referredFriendsList.reduce((sum, f) => sum + f.starsEarned, 0);
  const visibleFriends = showAllFriends ? user.referredFriendsList : user.referredFriendsList.slice(0, 3);

  return (
    <div style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", padding: "40px var(--space-header-px) 60px" }}>
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-[#002a38] text-center lg:text-left" style={{ fontSize: "1.375rem", fontWeight: 800 }}>
          {t("dashboard.title")}
        </h1>
        <p className="text-gray-400 text-center lg:text-left" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
          {user.firstName} {user.lastName}
        </p>
      </motion.div>

      {/* 2-col layout: left nav (desktop) | right content */}
      <div className="flex flex-col lg:flex-row lg:gap-10">
        {/* Left sidebar nav — desktop only */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:gap-1">
          <button
            onClick={() => setActiveTab("invite")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeTab === "invite" ? "bg-gray-100 text-[#002a38]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            <Users className="w-4.5 h-4.5" />
            {t("dashboard.inviteFriend")}
          </button>
          <button
            onClick={() => setActiveTab("vouchers")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeTab === "vouchers" ? "bg-gray-100 text-[#002a38]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            <History className="w-4.5 h-4.5" />
            {t("dashboard.voucherHistory")}
          </button>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-400 hover:bg-gray-50 hover:text-gray-500 transition-all duration-200"
            style={{ fontSize: "0.875rem", fontWeight: 600 }}
          >
            <LogOut className="w-4.5 h-4.5" />
            {t("dashboard.logout")}
          </button>
        </div>

        {/* Right main content */}
        <div className="flex-1 min-w-0">
          {/* Star Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl mb-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0068ff 0%, #3389ff 50%, #3389ff 100%)" }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-lg" />
            <div className="relative z-10 p-6">
              <p className="text-white/70 mb-1" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{t("dashboard.balance")}</p>
              <div className="flex items-center gap-3">
                <span className="text-white" style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1 }}>{user.stars}</span>
                <Star className="w-7 h-7 text-[#B0E89F] fill-[#B0E89F]" />
              </div>
            </div>
            {user.promoCodes.length > 0 && (
              <div className="relative z-10 border-t border-white/15 px-6 pb-5 pt-4">
                <p className="text-white/50 mb-2.5" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>{t("hero.auth.activatedCodes")}</p>
                <div className={`space-y-2 ${user.promoCodes.length >= 5 ? "max-h-[220px] overflow-y-auto pr-1" : ""}`}>
                  {user.promoCodes.map((code) => (
                    <PromoCodeWithExpiry key={code} code={code} variant="light" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Mobile tabs — hidden on desktop */}
          <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5 lg:hidden">
            <button
              onClick={() => setActiveTab("invite")}
              className={`flex-1 py-2.5 rounded-xl text-center transition-all duration-200 ${
                activeTab === "invite" ? "bg-white text-[#002a38] shadow-sm" : "text-gray-400 hover:text-gray-500"
              }`}
              style={{ fontSize: "0.8125rem", fontWeight: 600 }}
            >
              {t("dashboard.inviteFriend")}
            </button>
            <button
              onClick={() => setActiveTab("vouchers")}
              className={`flex-1 py-2.5 rounded-xl text-center transition-all duration-200 ${
                activeTab === "vouchers" ? "bg-white text-[#002a38] shadow-sm" : "text-gray-400 hover:text-gray-500"
              }`}
              style={{ fontSize: "0.8125rem", fontWeight: 600 }}
            >
              {t("dashboard.voucherHistory")}
            </button>
          </div>

          {/* Tab content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "invite" ? (
            <motion.div
              key="invite"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <div className="p-5 pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#B0E89F] flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#1a6b0f]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 700 }}>
                      {t("dashboard.inviteFriend")}
                    </h3>
                    <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                      {t("dashboard.inviteSubtitle")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span
                      className="text-[#0068ff] tracking-wider"
                      style={{ fontSize: "0.9375rem", fontWeight: 700 }}
                    >
                      {user.referralCode}
                    </span>
                    <button onClick={copyReferralCode} className="text-gray-400 hover:text-[#0068ff] transition-colors">
                      {copiedReferral ? (
                        <Check className="w-4.5 h-4.5 text-green-500" />
                      ) : (
                        <Copy className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {user.referredFriendsList.length > 0 && (
                <div className="border-t border-gray-100">
                  <div className="px-5 pt-3.5 pb-1">
                    <p className="text-gray-400" style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.03em" }}>
                      {t("dashboard.invitedFriends")} ({user.referredFriendsList.length})
                    </p>
                  </div>
                  <div className="px-5 pb-2">
                    {visibleFriends.map((friend, i) => (
                      <motion.div
                        key={friend.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#e6f0ff] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-[#0068ff]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#002a38] truncate" style={{ fontSize: "0.8125rem", fontWeight: 600 }}>
                            {friend.name}
                          </p>
                          <p className="text-gray-400" style={{ fontSize: "0.6875rem" }}>
                            {formatDate(friend.joinedAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-[#DCEFD2] rounded-full px-2.5 py-1 shrink-0">
                          <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
                          <span className="text-[#3FA62E]" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                            +{friend.starsEarned}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {user.referredFriendsList.length > 3 && (
                    <button
                      onClick={() => setShowAllFriends(!showAllFriends)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-gray-100 text-[#0068ff] hover:bg-[#e6f0ff]/50 transition-colors"
                      style={{ fontSize: "0.8125rem", fontWeight: 600 }}
                    >
                      {showAllFriends ? (
                        <>
                          {t("dashboard.showLess")} <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          {t("dashboard.showAll")} ({user.referredFriendsList.length}) <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {user.referredFriendsList.length === 0 && (
                <div className="border-t border-gray-100 px-5 py-4 text-center">
                  <p className="text-gray-400" style={{ fontSize: "0.8125rem" }}>
                    {t("dashboard.noFriendsYet")}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="vouchers"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {user.purchasedVouchers.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#e6f0ff] flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-7 h-7 text-[#0068ff]" />
                  </div>
                  <h3 className="text-[#002a38] mb-1" style={{ fontSize: "1rem", fontWeight: 700 }}>
                    {t("dashboard.noVouchers")}
                  </h3>
                  <p className="text-gray-400 max-w-[220px] mx-auto" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    {t("dashboard.noVouchersSubtitle")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.purchasedVouchers.map((voucher, i) => {
                    const isCopied = copiedVoucherIds.has(voucher.id);
                    return (
                      <motion.div
                        key={voucher.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#0068ff]/20 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#e6f0ff] flex items-center justify-center shrink-0">
                              <ShoppingBag className="w-5 h-5 text-[#0068ff]" />
                            </div>
                            <div>
                              <h3 className="text-[#002a38]" style={{ fontSize: "0.9375rem", fontWeight: 600 }}>
                                {voucher.name}
                              </h3>
                              <p className="text-gray-400" style={{ fontSize: "0.6875rem" }}>
                                {formatDate(voucher.purchasedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[#DCEFD2] rounded-full px-2.5 py-1">
                            <Star className="w-3 h-3 text-[#3FA62E] fill-[#3FA62E]" />
                            <span className="text-[#3FA62E]" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                              {voucher.stars}
                            </span>
                          </div>
                        </div>

                        {/* Voucher Code Row */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-2.5 mb-2">
                          <span className="text-gray-400" style={{ fontSize: "0.6875rem", fontWeight: 500 }}>
                            {t("dashboard.code")}
                          </span>
                          <span
                            className="flex-1 text-[#002a38] tracking-wider"
                            style={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.05em" }}
                          >
                            {voucher.code}
                          </span>
                          <button
                            onClick={() => copyVoucherCode(voucher.id, voucher.code)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-all ${
                              isCopied
                                ? "bg-green-100 text-green-600"
                                : "bg-[#e6f0ff] text-[#0068ff] hover:bg-[#d6e6ff]"
                            }`}
                            style={{ fontSize: "0.6875rem", fontWeight: 600 }}
                          >
                            {isCopied ? (
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

                        {/* Expiration date */}
                        <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2.5 py-1.5 w-fit">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-500" style={{ fontSize: "0.6875rem", fontWeight: 600 }}>
                            {t("dashboard.expires")} {formatDate(voucher.expiresAt)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
        </div>
      </div>

      {/* Logout Button — mobile only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 mb-4 lg:hidden"
      >
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-gray-200 text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-gray-500 transition-all duration-200"
          style={{ fontSize: "0.875rem", fontWeight: 600 }}
        >
          <LogOut className="w-4.5 h-4.5" />
          {t("dashboard.logout")}
        </button>
      </motion.div>
    </div>
  );
}