import { useState, useEffect, useRef } from "react";
import { X, Star, Phone, User, Calendar, Gift, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import { useLanguage } from "../../i18n/language-context";
import logoSvg from "../../assets/logo.svg";

export interface AuthIntent {
  promoCode?: string;
  promoStars?: number;
  voucherName?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitchMode: (mode: "login" | "register") => void;
  intent?: AuthIntent;
  onAuthSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode, intent, onAuthSuccess }: AuthModalProps) {
  const { login, register } = useAuth();
  const { t } = useLanguage();

  // Lock page scroll when modal is open to prevent background scrolling and scrollbar layout shift
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    promoCode: "",
  });
  const [loginPhone, setLoginPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Reset OTP state when modal closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      setOtpMode(false);
      setOtpCode(["", "", "", ""]);
      setOtpResendTimer(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!otpMode) {
      setOtpCode(["", "", "", ""]);
    }
  }, [otpMode]);

  // OTP resend countdown
  useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => setOtpResendTimer(otpResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

  // Auto-focus first OTP input
  useEffect(() => {
    if (otpMode) {
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    }
  }, [otpMode]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3 && newCode.every(d => d !== "")) {
      handleOtpSubmit(newCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = (code?: string[]) => {
    const finalCode = code || otpCode;
    if (finalCode.some(d => d === "")) {
      toast.error(t("auth.otp.enterCode"));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const success = register(formData);
      if (success) {
        toast.success(t("auth.registerSuccess"), {
          icon: <Star className="w-5 h-5 text-[#3FA62E] fill-[#3FA62E]" />,
        });
        setFormData({ firstName: "", lastName: "", phone: "", birthDate: "", promoCode: "" });
        setOtpMode(false);
        setOtpCode(["", "", "", ""]);
        onAuthSuccess?.();
        onClose();
        // User stays on current page
      }
      setIsSubmitting(false);
    }, 1200);
  };

  const handleResendOtp = () => {
    setOtpResendTimer(30);
    toast.success(t("auth.otp.codeSent"));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate age 18+
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 18) {
        toast.error(t("auth.ageError"));
        setIsSubmitting(false);
        return;
      }
    }

    // Simulate sending OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpMode(true);
      setOtpResendTimer(30);
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const success = login(loginPhone);
      if (success) {
        toast.success(t("auth.loginSuccess"));
        setLoginPhone("");
        onAuthSuccess?.();
        onClose();
        // User stays on current page
      } else {
        toast.error(t("auth.loginError"));
      }
      setIsSubmitting(false);
    }, 800);
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 pt-6 sm:p-8">
              {/* OTP Verification View */}
              {otpMode ? (
                <div>
                  {/* Back button */}
                  <button
                    onClick={() => setOtpMode(false)}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-[#0068ff] transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>{t("auth.otp.back")}</span>
                  </button>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <img src={logoSvg} alt="GiftMe.ge" className="w-16 h-16 mx-auto mb-4" style={{ filter: "drop-shadow(0 8px 24px rgba(0,104,255,0.35))" }} />
                    <h2 className="text-[#002a38] mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                      {t("auth.otp.title")}
                    </h2>
                    <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
                      {t("auth.otp.subtitle")}{" "}
                      <span className="text-[#002a38]" style={{ fontWeight: 600 }}>
                        {formData.phone || "5XX XXX XXX"}
                      </span>
                    </p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-14 h-14 text-center bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all text-[#002a38]"
                        style={{ fontSize: "1.5rem", fontWeight: 700 }}
                      />
                    ))}
                  </div>

                  {/* Test hint */}
                  <div className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#e6f0ff] rounded-xl mb-6">
                    <span style={{ fontSize: "0.75rem" }}>🧪</span>
                    <span className="text-[#0068ff]" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      {t("auth.otp.testHint")}
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="button"
                    onClick={() => handleOtpSubmit()}
                    disabled={isSubmitting || otpCode.some(d => d === "")}
                    className="w-full py-4 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ fontWeight: 600, fontSize: '1rem' }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      t("auth.otp.confirm")
                    )}
                  </button>

                  {/* Resend */}
                  <div className="text-center mt-5">
                    {otpResendTimer > 0 ? (
                      <p className="text-gray-400" style={{ fontSize: '0.8125rem' }}>
                        {t("auth.otp.resend")}{" "}
                        <span style={{ fontWeight: 600 }}>{otpResendTimer}წ</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#0068ff] hover:underline"
                        style={{ fontSize: '0.8125rem', fontWeight: 600 }}
                      >
                        {t("auth.otp.resend")}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
              <>
              {/* Header */}
              <div className="text-center mb-6">
                <img src={logoSvg} alt="GiftMe.ge" className="w-16 h-16 mx-auto mb-4" style={{ filter: "drop-shadow(0 8px 24px rgba(0,104,255,0.35))" }} />
                <h2 className="text-[#002a38] mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {mode === "register" ? t("auth.registerTitle") : t("auth.loginTitle")}
                </h2>
                <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>
                  {mode === "register"
                    ? t("auth.registerSubtitle")
                    : t("auth.loginSubtitle")}
                </p>
              </div>

              {intent && (intent.promoCode || intent.voucherName) && (
                <div className="mb-5 rounded-2xl border border-[#B0E89F] bg-[#f4faef] p-4">
                  <p className="text-[#1a6b0f] mb-2.5" style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    შენი მოგება
                  </p>
                  <ul className="space-y-1.5">
                    {intent.promoCode && intent.promoStars !== undefined && intent.promoStars > 0 && (
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#3FA62E] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[#002a38] flex items-center gap-1" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                          +{intent.promoStars}
                          <Star className="w-3.5 h-3.5 text-[#3FA62E] fill-[#3FA62E]" />
                          <span className="text-gray-500" style={{ fontWeight: 500 }}>({intent.promoCode})</span>
                        </span>
                      </li>
                    )}
                    {intent.voucherName && (
                      <li className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#0068ff] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[#002a38]" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                          {intent.voucherName} ვაუჩერი
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {mode === "register" ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {t("auth.firstName")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder={t("auth.firstNamePlaceholder")}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all placeholder:text-gray-400"
                        style={{ fontSize: '0.9375rem' }}
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {t("auth.lastName")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder={t("auth.lastNamePlaceholder")}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all placeholder:text-gray-400"
                        style={{ fontSize: '0.9375rem' }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {t("auth.phone")}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="5XX XXX XXX"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all placeholder:text-gray-400"
                        style={{ fontSize: '0.9375rem' }}
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {t("auth.birthDate")}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={(e) => updateField("birthDate", e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all text-gray-700"
                        style={{ fontSize: '0.9375rem' }}
                      />
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {t("auth.promoCode")} <span className="text-gray-400" style={{ fontWeight: 400 }}>{t("auth.promoCodeOptional")}</span>
                    </label>
                    <div className="relative">
                      <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.promoCode}
                        onChange={(e) => updateField("promoCode", e.target.value.toUpperCase())}
                        placeholder={t("auth.promoCodePlaceholder")}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all placeholder:text-gray-400"
                        style={{ fontSize: '0.9375rem' }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-6"
                    style={{ fontWeight: 600, fontSize: '1rem' }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      t("auth.registerButton")
                    )}
                  </button>

                  {/* Switch to login */}
                  <p className="text-center text-gray-500" style={{ fontSize: '0.875rem' }}>
                    {t("auth.haveAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => onSwitchMode("login")}
                      className="text-[#0068ff] hover:underline"
                      style={{ fontWeight: 600 }}
                    >
                      {t("auth.loginTitle")}
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 mb-1.5" style={{ fontSize: '0.8125rem', fontWeight: 500 }}>
                      {t("auth.phone")}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="5XX XXX XXX"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0068ff]/30 focus:border-[#0068ff] transition-all placeholder:text-gray-400"
                        style={{ fontSize: '0.9375rem' }}
                      />
                    </div>
                  </div>

                  {/* Test hint */}
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-[#e6f0ff] rounded-xl">
                    <span style={{ fontSize: "0.75rem" }}>🧪</span>
                    <span className="text-[#0068ff]" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                      {t("auth.testHint")} <span style={{ fontWeight: 700 }}>555</span>
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#0068ff] to-[#3389ff] text-white rounded-2xl hover:shadow-lg hover:shadow-[#0068ff]/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                    style={{ fontWeight: 600, fontSize: '1rem' }}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      t("auth.loginButton")
                    )}
                  </button>

                  {/* Switch to register */}
                  <p className="text-center text-gray-500 pt-2" style={{ fontSize: '0.875rem' }}>
                    {t("auth.noAccount")}{" "}
                    <button
                      type="button"
                      onClick={() => onSwitchMode("register")}
                      className="text-[#0068ff] hover:underline"
                      style={{ fontWeight: 600 }}
                    >
                      {t("auth.registerTitle")}
                    </button>
                  </p>
                </form>
              )}
              </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
