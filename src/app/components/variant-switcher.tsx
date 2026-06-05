import { motion } from "motion/react";

interface VariantSwitcherProps {
  variant: 1 | 2;
  onChange: (v: 1 | 2) => void;
}

/**
 * Floating A/B switcher to preview the hero from the `v4` branch (variant 1)
 * vs the `v5` branch (variant 2). Dev/preview affordance only.
 */
export function VariantSwitcher({ variant, onChange }: VariantSwitcherProps) {
  return (
    <div className="fixed z-[9998] bottom-4 left-1/2 -translate-x-1/2 px-2">
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-lg shadow-gray-300/40 rounded-full p-1">
        <span className="text-gray-400 pl-2.5 pr-1 hidden sm:block" style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.02em" }}>
          VARIANT
        </span>
        {([1, 2] as const).map((v) => {
          const active = variant === v;
          return (
            <button
              key={v}
              onClick={() => onChange(v)}
              aria-pressed={active}
              className={`relative rounded-full px-4 py-1.5 transition-colors ${active ? "text-white" : "text-gray-500 hover:text-[#002a38]"}`}
              style={{ fontSize: "0.8125rem", fontWeight: 700 }}
            >
              {active && (
                <motion.span
                  layoutId="variant-pill"
                  className="absolute inset-0 rounded-full bg-[#0068ff]"
                  transition={{ type: "spring", damping: 26, stiffness: 320 }}
                />
              )}
              <span className="relative z-10">{v}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
