import { ArrowLeft, Gift, Star, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

export function VoucherRulesPage() {
  const voucherRules = [
    {
      emoji: "🛒",
      name: "კროკოშოპი",
      rules: ["ვაუჩერის გამოყენება შესაძლებელია ნებისმიერ ნივთზე.", "არ ხდება ველქამ და სხვა ვაუჩერებთან ერთად გამოყენება."],
    },
    {
      emoji: "🍊",
      name: "ციტრუსი",
      rules: ["ვაუჩერის გამოყენება შესაძლებელია ნებისმიერ ნივთზე.", "არ ხდება ველქამ და სხვა ვაუჩერებთან ერთად გამოყენება."],
    },
    {
      emoji: "🏠",
      name: "ბეკო",
      rules: [
        "ვაუჩერის გამოყენება შესაძლებელია კროკოშოპზე მხოლოდ ბეკოს ბრენდის პროდუქციაზე.",
        "არ ხდება ველქამ და სხვა ვაუჩერებთან ერთად გამოყენება.",
      ],
    },
    {
      emoji: "💳",
      name: "კროკოსქარდი",
      rules: [
        "ვაუჩერის გამოსაყენებლად სავალდებულოა 25+ ასაკი.",
        "არ ხდება ველქამ და სხვა ვაუჩერებთან ერთად გამოყენება.",
      ],
    },
    {
      emoji: "🎁",
      name: "მისთერი BOX",
      rules: [
        "არჩევის შემთხვევაში შეიძლება ამოგივიდეთ: iPhone, PlayStation.",
        "ვაუჩერის მეორედ არჩევის შესაძლებლობა — ამ შემთხვევაში ვაუჩერის ღირებულება ხდება X2, X5 ან X10.",
        "მისთერი BOX-ის შედეგი საბოლოოა და გასაჩივრებას არ ექვემდებარება.",
      ],
    },
  ];

  const generalRules = [
    "პრომო კოდის გამოყენება შესაძლებელია მხოლოდ 1-ჯერ, ვარსკვლავების გახარჯვამდე.",
    "ვაუჩერის კოდის მეშვეობით ვარსკვლავების მიღება ხდება მხოლოდ ერთხელ.",
    "ვაუჩერების გამოყენება არ ხდება ველქამ და სხვა ვაუჩერებთან ერთად.",
    "ვაუჩერს აქვს გააქტიურების ვადა — ტაიმერი. ვადის გასვლის შემდეგ ვაუჩერი ანულირდება.",
  ];

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[#0068ff] mb-6 hover:opacity-80 transition-opacity"
        style={{ fontSize: '0.875rem', fontWeight: 500 }}
      >
        <ArrowLeft className="w-4 h-4" />
        მთავარი
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#e6f0ff] flex items-center justify-center">
            <Gift className="w-6 h-6 text-[#0068ff]" />
          </div>
          <div>
            <h1 className="text-[#002a38]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              ვაუჩერის წესები
            </h1>
            <p className="text-gray-400" style={{ fontSize: '0.8125rem' }}>
              გამოყენების პირობები
            </p>
          </div>
        </div>

        {/* General Warning */}
        <div className="bg-[#e8f5e0] border border-green-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#3FA62E] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[#002a38] mb-1" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              ზოგადი წესები
            </h3>
            <ul className="space-y-1.5">
              {generalRules.map((rule, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#3FA62E] shrink-0" style={{ fontSize: '0.75rem' }}>•</span>
                  <p className="text-gray-600" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Per-Voucher Rules */}
        <div className="space-y-4">
          {voucherRules.map((voucher, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-gray-100 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{voucher.emoji}</span>
                <h2 className="text-[#002a38]" style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {voucher.name}
                </h2>
              </div>
              <ul className="space-y-2">
                {voucher.rules.map((rule, j) => (
                  <li key={j} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0068ff] mt-2 shrink-0" />
                    <p className="text-gray-600" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                      {rule}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Referral Rules */}
        <div className="mt-8 bg-[#e6f0ff] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-[#0068ff] fill-[#0068ff]" />
            <h2 className="text-[#002a38]" style={{ fontSize: '1rem', fontWeight: 600 }}>
              მეგობრის მოწვევა
            </h2>
          </div>
          <ul className="space-y-2">
            {[
              "თითოეული მომხმარებელი, რომელიც დაარეგისტრირებს ახალ მომხმარებელს, მიიღებს 5 ვარსკვლავს.",
              "ახალი მომხმარებელი უნდა იყოს 18+ ასაკის.",
              "რეგისტრაციის შემდეგ ახალმა მომხმარებელმა პრომო კოდის ველში უნდა ჩაწეროს მომწვევის კოდი.",
              "ბონუსი ირიცხება მხოლოდ მაშინ, როცა ახალი მომხმარებელი გაანაღდებს მინიმუმ 15 ვარსკვლავის ღირებულების საჩუქარს.",
            ].map((rule, i) => (
              <li key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0068ff] mt-2 shrink-0" />
                <p className="text-gray-700" style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  {rule}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 p-4 bg-[#f8f7fc] rounded-2xl">
          <p className="text-gray-500 text-center" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
            ბოლო განახლება: 16 მარტი, 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
