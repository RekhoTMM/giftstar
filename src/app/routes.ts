import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { LandingPage } from "./components/landing-page";
import { RulesPage } from "./components/rules-page";
import { VoucherRulesPage } from "./components/voucher-rules-page";
import { Dashboard } from "./components/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "dashboard", Component: Dashboard },
      { path: "rules", Component: RulesPage },
      { path: "voucher-rules", Component: VoucherRulesPage },
      { path: "*", Component: LandingPage },
    ],
  },
]);
