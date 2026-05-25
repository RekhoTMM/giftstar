import { useState, useEffect, useCallback } from "react";
import { Star, X, Sparkles } from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { useLanguage } from "../../i18n/language-context";

// Mystery BOX possible prizes
const MYSTERY_PRIZES = [
  {
    id: "iphone",
    name: "iPhone",
    type: "image" as const,
    image: "https://www.pngall.com/wp-content/uploads/20/iPhone-17-Pro-Max-Concept-Art-PNG.png",
    description: "მოიგე უახლესი iPhone!",
    color: "#0068ff",
    weight: 5,
  },
  {
    id: "ps5",
    name: "PlayStation",
    type: "image" as const,
    image: "https://wallpapers.com/images/featured/ps5-console-png-ywbv2gv3gfw23o3w.jpg",
    description: "მოიგე Sony PlayStation კონსოლი!",
    color: "#3b82f6",
    weight: 5,
  },
  {
    id: "laptop",
    name: "ლეპტოპი",
    type: "image" as const,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop",
    description: "მოიგე ლეპტოპი!",
    color: "#10b981",
    weight: 5,
  },
  {
    id: "tv",
    name: "ტელევიზორი",
    type: "image" as const,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop",
    description: "მოიგე ტელევიზორი!",
    color: "#3b82f6",
    weight: 5,
  },
  {
    id: "krokoVoucher",
    name: "კროკოშოპის ვაუჩერი",
    type: "voucher" as const,
    voucherColor: "#0068ff",
    description: "კროკოშოპის ვაუჩერი!",
    color: "#0068ff",
    weight: 15,
  },
  {
    id: "citrusVoucher",
    name: "ციტრუსის ვაუჩერი",
    type: "voucher" as const,
    voucherColor: "#3FA62E",
    description: "ციტრუსის ვაუჩერი!",
    color: "#3FA62E",
    weight: 15,
  },
  {
    id: "x2",
    name: "ვაუჩერის ღირებულება X2",
    type: "x2" as const,
    description: "მიიღე ვაუჩერის ღირებულების გაორმაგება!",
    color: "#0068ff",
    weight: 20,
  },
  {
    id: "stars5",
    name: "5 ვარსკვლავი",
    type: "star" as const,
    description: "მიიღე 5 ბონუს ვარსკვლავი!",
    color: "#3FA62E",
    starsWon: 5,
    weight: 15,
  },
  {
    id: "stars20",
    name: "20 ვარსკვლავი",
    type: "star" as const,
    description: "მიიღე 20 ბონუს ვარსკვლავი!",
    color: "#3FA62E",
    starsWon: 20,
    weight: 10,
  },
  {
    id: "stars30",
    name: "30 ვარსკვლავი",
    type: "star" as const,
    description: "მიიღე 30 ბონუს ვარსკვლავი!",
    color: "#3FA62E",
    starsWon: 30,
    weight: 5,
  },
];

function pickPrize() {
  const totalWeight = MYSTERY_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  for (const prize of MYSTERY_PRIZES) {
    random -= prize.weight;
    if (random <= 0) return prize;
  }
  return MYSTERY_PRIZES[2]; // fallback to X2
}


interface MysteryBoxAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  onPrizeRevealed?: (prize: typeof MYSTERY_PRIZES[0]) => void;
}

type Phase = "idle" | "shaking" | "opening" | "revealed";

export function MysteryBoxAnimation({
  isOpen,
  onClose,
  onPrizeRevealed,
}: MysteryBoxAnimationProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("idle");
  const [prize, setPrize] = useState<typeof MYSTERY_PRIZES[0] | null>(null);
  const [prizeRevealed, setPrizeRevealed] = useState(false);

  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#0068ff", "#3389ff", "#3FA62E", "#5BBF4A", "#34d399"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        zIndex: 200,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        zIndex: 200,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    // Big burst in center
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.45 },
        colors,
        zIndex: 200,
      });
    }, 200);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPhase("idle");
      setPrize(null);
      setPrizeRevealed(false);
      return;
    }

    // Start shaking after a brief pause
    const t1 = setTimeout(() => setPhase("shaking"), 500);

    // Open after shaking
    const t2 = setTimeout(() => {
      setPhase("opening");
      const selectedPrize = pickPrize();
      setPrize(selectedPrize);
    }, 2500);

    // Reveal prize
    const t3 = setTimeout(() => {
      setPhase("revealed");
      fireConfetti();
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, fireConfetti]);

  useEffect(() => {
    if (phase === "revealed" && prize && onPrizeRevealed && !prizeRevealed) {
      setPrizeRevealed(true);
      onPrizeRevealed(prize);
    }
  }, [phase, prize, prizeRevealed]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center px-5"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(0,104,255,0.3) 0%, rgba(0,0,0,0.88) 70%)",
            }}
          />

          {/* Close button (only after revealed) */}
          {phase === "revealed" && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-[160] w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2
                className="text-white mb-1"
                style={{ fontSize: "1.5rem", fontWeight: 800 }}
              >
                Mystery BOX
              </h2>
              <p className={phase === "revealed" ? "text-white/80" : "text-white/80"} style={{ fontSize: "0.875rem" }}>
                {phase === "idle"
                  ? t("mysteryBox.ready")
                  : phase === "shaking"
                  ? t("mysteryBox.opening")
                  : t("mysteryBox.congrats")}
              </p>
            </motion.div>

            {/* Box animation */}
            {phase !== "revealed" ? (
              <motion.div
                animate={
                  phase === "shaking"
                    ? {
                        rotate: [-3, 3, -3, 3, -5, 5, -5, 5, -8, 8, 0],
                        scale: [1, 1.02, 1, 1.02, 1, 1.05, 1, 1.05, 1.1, 1],
                      }
                    : phase === "opening"
                    ? { scale: [1, 1.3, 0], rotate: 0, opacity: [1, 1, 0] }
                    : {}
                }
                transition={
                  phase === "shaking"
                    ? { duration: 2, ease: "easeInOut" }
                    : phase === "opening"
                    ? { duration: 0.6, ease: "easeIn" }
                    : {}
                }
                className="relative"
              >
                {/* Glow ring behind box */}
                <motion.div
                  animate={
                    phase === "shaking"
                      ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }
                      : {}
                  }
                  transition={
                    phase === "shaking"
                      ? { duration: 1, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                  className="absolute inset-0 -m-6 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0,104,255,0.4) 0%, transparent 70%)",
                  }}
                />

                {/* The box */}
                <div className="w-36 h-36 relative">
                  {/* Box body */}
                  <div
                    className="absolute inset-0 rounded-3xl shadow-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(160deg, #3389ff 0%, #0068ff 30%, #0068ff 55%, #0058d9 100%)",
                      boxShadow: "0 0 60px rgba(0,104,255,0.5)",
                    }}
                  >
                    {/* Ribbon cross */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute w-full h-3 bg-[#3FA62E]/60 rounded-sm" />
                      <div className="absolute w-3 h-full bg-[#3FA62E]/60 rounded-sm" />
                    </div>

                    {/* Center gift icon */}
                    <span style={{ fontSize: "3.5rem" }}>🎁</span>
                  </div>

                  {/* Sparkle particles */}
                  {phase === "shaking" && (
                    <>
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [-10, -30 - Math.random() * 20],
                            x: [0, (Math.random() - 0.5) * 60],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeOut",
                          }}
                          className="absolute"
                          style={{
                            top: "10%",
                            left: `${20 + i * 10}%`,
                          }}
                        >
                          <Sparkles className="w-3 h-3 text-[#3FA62E]" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            ) : (
              /* Prize revealed */
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className="flex flex-col items-center"
              >
                {/* Prize icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.15, damping: 12 }}
                  className="w-28 h-28 rounded-3xl flex items-center justify-center mb-5 overflow-hidden"
                  style={{
                    backgroundColor: prize?.type === "image" ? "#ffffff" : prize?.type === "voucher" ? (prize?.voucherColor === "#0068ff" ? "#e6f0ffcc" : prize?.voucherColor === "#3FA62E" ? "#e8f5e0cc" : "#e6f0ffcc") : prize?.type === "x2" ? "#e6f0ffcc" : prize?.type === "star" ? "#DCEFD2" : "#ffffff",
                    boxShadow: `0 0 80px ${prize?.color}80, 0 8px 32px rgba(0,0,0,0.4)`,
                    opacity: 1,
                  }}
                >
                  {prize?.type === "image" && (
                    <img src={prize.image} alt={t(`mysteryBox.prizes.${prize.id}.name`)} className="w-full h-full object-cover" />
                  )}
                  {prize?.type === "voucher" && (
                    <span style={{ fontSize: "2.5rem", fontWeight: 800, color: prize.voucherColor }}>₾</span>
                  )}
                  {prize?.type === "x2" && (
                    <span className="text-[#0068ff]" style={{ fontSize: "2.5rem", fontWeight: 800 }}>X2</span>
                  )}
                  {prize?.type === "star" && (
                    <Star className="w-14 h-14 fill-[#3FA62E]" strokeWidth={0} />
                  )}
                </motion.div>

                {/* Prize name */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-center mb-6"
                  style={{ fontSize: "1.25rem", fontWeight: 600 }}
                >
                  {t("mysteryBox.youWon")} {prize ? t(`mysteryBox.prizes.${prize.id}.name`) : ""}
                </motion.h3>


                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="px-10 py-3.5 bg-white text-[#0068ff] rounded-full shadow-xl hover:shadow-2xl transition-all"
                  style={{ fontWeight: 700, fontSize: "1rem" }}
                >
                  {t("mysteryBox.viewPrize")}
                </motion.button>
              </motion.div>
            )}

            {/* Loading indicator during phases */}
            {phase !== "revealed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-1.5"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className="w-2 h-2 rounded-full bg-white/60"
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}