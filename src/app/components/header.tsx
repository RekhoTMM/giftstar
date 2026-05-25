import { useState } from "react";
import { Link } from "react-router";
import { Star, User } from "lucide-react";
import logoSvg from "../../assets/logo.svg";
import { AuthModal } from "./auth-modal";
import { useAuth } from "./auth-context";
import { useLanguage } from "../../i18n/language-context";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setShowAuth(true);
  };

  return (
    <>
      <header className="site-header sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100" style={{ width: "100%" }}>
        <div className="header-container flex items-center justify-between" style={{ maxWidth: "var(--size-container-max)", margin: "0 auto", padding: "0 var(--space-header-px)", height: "var(--size-header-height)" }}>
          <Link to="/" className="header-logo flex items-center gap-2 transition-opacity duration-200 hover:opacity-80">
            <img src={logoSvg} alt="GiftMe.ge" className="w-8 h-8" style={{ filter: "drop-shadow(0 8px 24px rgba(0,104,255,0.35))" }} />
            <span className="text-[#0068ff] tracking-tight leading-none translate-y-[1px]" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              GiftMe<span className="text-[#002a38]">.ge</span>
            </span>
          </Link>

          <div className="header-actions flex items-center" style={{ gap: "var(--space-sm)" }}>
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/dashboard"
                  className="header-star-balance flex items-center gap-1.5 px-3.5 py-2 bg-[#DCEFD2] rounded-xl hover:bg-[#c8e8b8] transition-all duration-200 hover:shadow-sm"
                >
                  <Star className="w-4 h-4 text-[#3FA62E] fill-[#3FA62E]" />
                  <span className="text-[#002a38]" style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    {user.stars}
                  </span>
                </Link>

                <Link
                  to="/dashboard"
                  className="header-user-avatar w-9 h-9 rounded-xl bg-gradient-to-br from-[#0068ff] to-[#3389ff] flex items-center justify-center text-white transition-all duration-200 hover:shadow-md hover:shadow-[#0068ff]/25 hover:scale-105"
                >
                  <User className="w-4.5 h-4.5" />
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="header-login-button px-4 py-2 text-[#0068ff] hover:bg-[#e6f0ff] rounded-xl transition-all duration-200"
                  style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                >
                  {t("header.login")}
                </button>
                <button
                  onClick={openRegister}
                  className="header-register-button px-4 py-2 bg-[#0068ff] text-white rounded-xl hover:bg-[#0055cc] transition-all duration-200 shadow-md shadow-[#0068ff]/20 hover:shadow-lg hover:shadow-[#0068ff]/30"
                  style={{ fontSize: '0.8125rem', fontWeight: 500 }}
                >
                  {t("header.register")}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </>
  );
}
