# GiftStar — v3 Hero Redesign

## Overview

GiftStar / GiftMe.ge is a Georgian loyalty/rewards platform where users collect stars from promo codes and exchange them for vouchers (Crocoshop, Citrus, Beko, Crococard, Wolt, Mystery Box).

Branch strategy:
- `main` — production (Netlify auto-deploys)
- `v3` — current iteration of the hero redesign (active)

This document captures everything built on `v3`.

## Stack

- React 18 + Vite 6 + TypeScript (Figma Make export)
- Tailwind CSS v4 with custom properties in `theme.css`
- Framer Motion (`motion/react`) — animations + `AnimatePresence`
- `createPortal` for modals
- i18n: KA / EN / RU JSON files
- Routing: `react-router`

## What v3 changed

### 1. Two-step swap hero (`hero-section.tsx`)

Replaced the old "guest landing vs auth promo form" split with a single interactive **SwapPanel** shown to both guests and authenticated users.

**Step 1 — Promo code card**
- Title: "შეიყვანე პრომო კოდი და მიიღე ვარსკვლავები"
- Input with placeholder, auto-uppercases user input
- "გამოყენება" (apply) button: on mobile stacks below the input, on web stays beside it
- Info row between input and button on mobile (below both on web):
  - Left: "1 ვარსკვლავი = 1 ლ"
  - Right (when typing a valid code): "მიიღებ ⭐ X ვარსკვლავს" in green
- Live validation: green `Check` icon inside the input when the typed code matches a known promo
- On apply success: shows the green success state with "+N ვარსკვლავი დაემატა! · ბალანსი განახლდა"

**Step 2 — Voucher picker card** (`id="hero-voucher-picker"` for scroll-into-view)
- Title: "გადაცვალე ვარსკვლავები ვაუჩერში"
- Balance line "ბალანსი: ⭐ N" sits BELOW the title (hidden for guests)
- Picker container shows either:
  - Selected voucher: image + name + description + chevron (no price, no "შეცვლა" label)
  - Placeholder (mobile): title "აირჩიე ვაუჩერი" on one line + avatar stack of vouchers (28×28 with -6px overlap)
  - Placeholder (desktop): title + "5 ვაუჩერი ხელმისაწვდომია" subtitle on the left, avatar stack on the right
- Hover effect matches voucher grid cards (`hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-0.5`)
- Selected state stroke turns blue temporarily (2s) when a voucher is selected from the grid
- "გადაცვალე" CTA: blue with star + cost badge when a voucher is selected, disabled otherwise

**Step connector** between cards: bare `ArrowDown` icon (no container)

**Auth handling for guests**
- Apply / Exchange buttons open the auth modal (`mode="register"`)
- Voucher picker modal is fully browsable for guests
- Balance line hidden

### 2. Voucher picker modal

Bottom sheet on mobile, centered on desktop. Padding aligned with auth modal (`p-6 sm:p-8` body, `px-6 sm:px-8 py-4` header).

Cards in the modal:
- Same hover effect as voucher grid (lift + large shadow)
- Selected state: blue stroke + blue shadow + filled blue `Check` badge at bottom-right
- Hover unselected state: light-blue badge → filled blue on hover

### 3. Vouchers section (`vouchers-section.tsx`)

- Shared `vouchers` data extracted to `voucher-data.ts` (krokoShop, citrus, beko, krokoCard, mysteryBox5)
- Card click behavior:
  - Guest: opens signup modal
  - Authenticated: selects the voucher in the hero picker, scrolls to `#hero-voucher-picker`, shows success toast with green check icon ("X არჩეულია")
- Selected card gets blue stroke + blue shadow (matches picker modal)
- ShoppingBag icon replaced with `Check` icon (light blue → solid blue on hover/selected)

### 4. Landing page (`landing-page.tsx`)

- Lifted `selectedVoucherIndex` state up so `HeroSection` and `VouchersSection` share it
- Passes `onSelectVoucher` down to both

### 5. i18n updates

New keys added to `ka.json`, `en.json`, `ru.json`:
- `hero.swap.*` — tabs, labels, redeem strings, success messages
- `vouchers.authRequired`
- Adjusted existing strings

### 6. Visual polish

- Floating star decorations: opacity dropped from `1` → `0.5`
- Voucher picker placeholder uses `bg-gray-100` (was gray-50) for more contrast
- Headline retains the green `B0E89F` highlight on "ვარსკვლავები"

## Files

| File | Purpose |
|------|---------|
| `src/app/components/hero-section.tsx` | `HeroSection`, `SwapPanel`, `VoucherPickerModal`, `usePurchaseFlow`, `PromoCodeWithExpiry` |
| `src/app/components/vouchers-section.tsx` | Voucher grid + info modal + purchase flow |
| `src/app/components/voucher-data.ts` | Shared `vouchers` array |
| `src/app/components/landing-page.tsx` | Owns shared `selectedVoucherIndex` state |
| `src/i18n/{ka,en,ru}.json` | Translations |

## Promo codes (mock data)

`PROMO_STARS` lookup in `hero-section.tsx`:
- `GIFT10` → 10
- `STAR20` → 20
- `PROMO5` → 5
- `BONUS15` → 15
- `VIP50` → 50

## Reverted / rejected approaches

- Variant tab bar comparing promo preview styles (pill in input / next to title / apply button) — kept pill only, then replaced with green check
- Skip / collapse step 1 for returning users — removed
- Auto-playing swap illustration for guests — removed (alongside Cards / Fan / Marquee variants)
- Marketing hero with separate "Get Started" CTA for guests — removed in favor of unified SwapPanel for everyone
- Persist pending action across signup + auto-replay — built then reverted
- Step connector with button-like circle background — reduced to bare arrow icon

## Local dev workflow

- Cloud Claude pushes commits to `v3` continuously
- Local clone runs `npm run dev` and pulls changes
- `git config pull.ff only` configured
- Optional auto-pull loop for live sync

## Deploy

`main` is wired to Netlify. The v3 hero was merged into `main` and deployed once (commit `2fe2c75`). Further v3 work continues on the branch until the next merge.

## Outstanding considerations

- 559 kB JS bundle warning from Vite — not blocking
- Auth modal's `intent` + `onAuthSuccess` plumbing was tried and reverted — could be revisited if pre-signup interaction needs to carry through
