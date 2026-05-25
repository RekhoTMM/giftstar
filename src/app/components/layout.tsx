import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";
import { AuthProvider } from "./auth-context";
import { LanguageProvider } from "../../i18n/language-context";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
