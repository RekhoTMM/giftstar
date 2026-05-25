import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ReferredFriend {
  id: string;
  name: string;
  phone: string;
  starsEarned: number;
  joinedAt: string;
}

export interface PurchasedVoucher {
  id: string;
  voucherId: string;
  name: string;
  code: string;
  stars: number;
  purchasedAt: string;
  expiresAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  stars: number;
  promoCode: string | null;
  promoCodes: string[]; // redeemed promo codes
  referralCode: string;
  referredFriends: number;
  referredFriendsList: ReferredFriend[];
  redeemedVouchers: string[];
  purchasedVouchers: PurchasedVoucher[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string) => boolean;
  register: (data: { firstName: string; lastName: string; phone: string; birthDate: string }) => boolean;
  logout: () => void;
  redeemPromoCode: (code: string) => { success: boolean; message: string; starsAdded?: number };
  purchaseVoucher: (voucherId: string, name: string, stars: number) => { success: boolean; message: string; voucherCode?: string };
  addStars: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Generate a mock voucher code
function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "GS-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  code += "-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Test user data for phone '555' — comes with some pre-existing voucher history
const TEST_USER: User = {
  id: "test-001",
  firstName: "გიორგი",
  lastName: "მაისურაძე",
  phone: "555",
  stars: 20,
  promoCode: null,
  promoCodes: [],
  referralCode: "GS-7X4K2M",
  referredFriends: 3,
  referredFriendsList: [
    {
      id: "rf-001",
      name: "ნინო ბერიძე",
      phone: "598***12",
      starsEarned: 5,
      joinedAt: "2026-03-15T09:20:00Z",
    },
    {
      id: "rf-002",
      name: "ლუკა კვარაცხელია",
      phone: "577***45",
      starsEarned: 5,
      joinedAt: "2026-03-13T16:45:00Z",
    },
    {
      id: "rf-003",
      name: "მარიამ ნოზაძე",
      phone: "551***78",
      starsEarned: 5,
      joinedAt: "2026-03-11T11:10:00Z",
    },
  ],
  redeemedVouchers: [],
  purchasedVouchers: [
    {
      id: "pv-001",
      voucherId: "krokoShop",
      name: "Crocoshop.ge",
      code: "GS-K7XR-4MPN",
      stars: 15,
      purchasedAt: "2026-03-14T10:30:00Z",
      expiresAt: "2026-04-13T10:30:00Z",
    },
    {
      id: "pv-002",
      voucherId: "citrus",
      name: "Citrus.ge",
      code: "GS-CT9W-2HBL",
      stars: 15,
      purchasedAt: "2026-03-12T14:15:00Z",
      expiresAt: "2026-04-11T14:15:00Z",
    },
  ],
};

// Valid mock promo codes
const VALID_PROMO_CODES: Record<string, { stars: number; label: string }> = {
  "GIFT10": { stars: 10, label: "10 ვარსკვლავი" },
  "STAR20": { stars: 20, label: "20 ვარსკვლავი" },
  "PROMO5": { stars: 5, label: "5 ვარსკვლავი" },
  "BONUS15": { stars: 15, label: "15 ვარსკვლავი" },
  "VIP50": { stars: 50, label: "50 ვარსკვლავი" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((phone: string): boolean => {
    if (phone === "555") {
      setUser({
        ...TEST_USER,
        purchasedVouchers: [...TEST_USER.purchasedVouchers],
        referredFriendsList: [...TEST_USER.referredFriendsList],
      });
      return true;
    }
    return false;
  }, []);

  const register = useCallback(
    (data: { firstName: string; lastName: string; phone: string; birthDate: string }): boolean => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        stars: 20,
        promoCode: null,
        promoCodes: [],
        referralCode: `GS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        referredFriends: 0,
        referredFriendsList: [],
        redeemedVouchers: [],
        purchasedVouchers: [],
      };
      setUser(newUser);
      return true;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const redeemPromoCode = useCallback(
    (code: string): { success: boolean; message: string; starsAdded?: number } => {
      if (!user) return { success: false, message: "გაიარეთ ავტორიზაცია" };

      const upperCode = code.toUpperCase().trim();

      if (user.promoCodes.includes(upperCode)) {
        return { success: false, message: "ეს პრომო კოდი უკვე გამოყენებულია" };
      }

      const promoData = VALID_PROMO_CODES[upperCode];
      if (!promoData) {
        return { success: false, message: "პრომო კოდი არასწორია" };
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              stars: prev.stars + promoData.stars,
              promoCodes: [...prev.promoCodes, upperCode],
              promoCode: upperCode,
            }
          : prev
      );

      return {
        success: true,
        message: `მიიღე ${promoData.stars} ვარსკვლავი!`,
        starsAdded: promoData.stars,
      };
    },
    [user]
  );

  const purchaseVoucher = useCallback(
    (voucherId: string, name: string, stars: number): { success: boolean; message: string; voucherCode?: string } => {
      if (!user) return { success: false, message: "გაიარეთ ავტორიზაცია" };

      if (user.stars < stars) {
        return { success: false, message: "არასაკმარისი ვარსკვლავები" };
      }

      const voucherCode = generateVoucherCode();

      setUser((prev) =>
        prev
          ? {
              ...prev,
              stars: prev.stars - stars,
              purchasedVouchers: [
                {
                  id: `pv-${Date.now()}`,
                  voucherId,
                  name,
                  code: voucherCode,
                  stars,
                  purchasedAt: new Date().toISOString(),
                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                },
                ...prev.purchasedVouchers,
              ],
            }
          : prev
      );

      return { success: true, message: `ვაუჩერი წარმატებით შეძენილია!`, voucherCode };
    },
    [user]
  );

  const addStars = useCallback((amount: number) => {
    setUser((prev) => (prev ? { ...prev, stars: prev.stars + amount } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, redeemPromoCode, purchaseVoucher, addStars }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}