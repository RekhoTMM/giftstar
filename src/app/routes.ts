import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { LandingPage } from "./components/landing-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "dashboard", lazy: async () => ({ Component: (await import("./components/dashboard")).Dashboard }) },
      { path: "rules", lazy: async () => ({ Component: (await import("./components/rules-page")).RulesPage }) },
      { path: "voucher-rules", lazy: async () => ({ Component: (await import("./components/voucher-rules-page")).VoucherRulesPage }) },
      { path: "*", Component: LandingPage },
    ],
  },
]);
