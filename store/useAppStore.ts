"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { defaultDraft, getMaterial, seedDrafts } from "@/data/catalog";
import { calculatePrice } from "@/lib/pricing/calculatePrice";
import { getDeliveryWindow } from "@/lib/orders/status";
import type { Address, CartItem, DesignDraft, Order, RegisteredUser, User } from "@/types";

const demoUser: RegisteredUser = {
  id: "user-demo",
  fullName: "نورة محمد",
  mobile: "0501234567",
  email: "demo@ghallif.sa",
  password: "Demo123!",
};

export const seedAddresses: Address[] = [
  {
    id: "address-riyadh",
    label: "المنزل",
    recipient: "نورة محمد",
    mobile: "0501234567",
    city: "الرياض",
    district: "حي النرجس",
    street: "طريق عثمان بن عفان",
    building: "124",
    postalCode: "13328",
  },
  {
    id: "address-jeddah",
    label: "العائلة",
    recipient: "سارة محمد",
    mobile: "0559876543",
    city: "جدة",
    district: "حي الروضة",
    street: "شارع الأمير سعود الفيصل",
    building: "42",
    postalCode: "23432",
  },
];

const makeItem = (design: DesignDraft, id: string): CartItem => ({
  id,
  design,
  price: calculatePrice(design),
  addedAt: design.updatedAt,
});

const seedOrders: Order[] = [
  {
    id: "demo-order",
    number: "GH-2609-1042",
    createdAt: "2026-09-14T13:20:00.000Z",
    status: "production",
    items: [makeItem(seedDrafts[0], "item-seed-1")],
    address: seedAddresses[0],
    paymentMethod: "mada",
    deliveryMethod: "standard",
    total: calculatePrice(seedDrafts[0]).total,
    estimatedDelivery: "2026-09-22",
  },
  {
    id: "demo-order-wood",
    number: "GH-2608-0931",
    createdAt: "2026-08-29T10:00:00.000Z",
    status: "shipped",
    items: [makeItem(seedDrafts[1], "item-seed-2")],
    address: seedAddresses[0],
    paymentMethod: "apple-pay",
    deliveryMethod: "express",
    total: calculatePrice(seedDrafts[1]).total,
    estimatedDelivery: "2026-09-18",
  },
  {
    id: "demo-order-leather",
    number: "GH-2608-0818",
    createdAt: "2026-08-18T08:40:00.000Z",
    status: "delivered",
    items: [makeItem(seedDrafts[2], "item-seed-3")],
    address: seedAddresses[1],
    paymentMethod: "credit-card",
    deliveryMethod: "standard",
    total: calculatePrice(seedDrafts[2]).total,
    estimatedDelivery: "2026-08-28",
  },
];

interface AppState {
  hasHydrated: boolean;
  session: User | null;
  registeredUsers: RegisteredUser[];
  draft: DesignDraft;
  savedDesigns: DesignDraft[];
  cart: CartItem[];
  addresses: Address[];
  orders: Order[];
  setHasHydrated: (value: boolean) => void;
  login: (identifier: string, password: string) => boolean;
  register: (user: Omit<RegisteredUser, "id">) => void;
  logout: () => void;
  updateDraft: (patch: Partial<DesignDraft>) => void;
  replaceDraft: (draft: DesignDraft) => void;
  resetDraft: () => void;
  saveDesign: () => string;
  deleteDesign: (id: string) => void;
  addToCart: () => string;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addAddress: (address: Omit<Address, "id">) => Address;
  createOrder: (address: Address, paymentMethod: Order["paymentMethod"], deliveryMethod: Order["deliveryMethod"]) => Order | null;
  resetDemo: () => void;
}

const cloneDraft = (draft: DesignDraft): DesignDraft => ({ ...draft, names: [...draft.names] });

const initialData = () => ({
  session: null as User | null,
  registeredUsers: [{ ...demoUser }],
  draft: cloneDraft(defaultDraft),
  savedDesigns: seedDrafts.map(cloneDraft),
  cart: [] as CartItem[],
  addresses: seedAddresses.map((address) => ({ ...address })),
  orders: seedOrders.map((order) => ({ ...order, items: order.items.map((item) => ({ ...item, design: cloneDraft(item.design) })) })),
});

const makeId = (prefix: string) => {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${suffix}`;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      ...initialData(),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (identifier, password) => {
        const normalized = identifier.trim().toLowerCase();
        const match = get().registeredUsers.find(
          (user) => (user.email.toLowerCase() === normalized || user.mobile === identifier.trim()) && user.password === password,
        );
        if (!match) return false;
        const { password: _password, ...session } = match;
        set({ session });
        return true;
      },
      register: (newUser) => {
        const user: RegisteredUser = { ...newUser, id: makeId("user") };
        const { password: _password, ...session } = user;
        set((state) => ({ registeredUsers: [...state.registeredUsers, user], session }));
      },
      logout: () => set({ session: null }),
      updateDraft: (patch) => set((state) => ({
        draft: { ...state.draft, ...patch, updatedAt: new Date().toISOString() },
      })),
      replaceDraft: (draft) => set({ draft: cloneDraft(draft) }),
      resetDraft: () => set({ draft: cloneDraft(defaultDraft) }),
      saveDesign: () => {
        const current = get().draft;
        const id = current.id === "draft-main" ? makeId("design") : current.id;
        const design = { ...cloneDraft(current), id, updatedAt: new Date().toISOString() };
        set((state) => ({
          savedDesigns: [design, ...state.savedDesigns.filter((item) => item.id !== id)],
          draft: design,
        }));
        return id;
      },
      deleteDesign: (id) => set((state) => ({ savedDesigns: state.savedDesigns.filter((design) => design.id !== id) })),
      addToCart: () => {
        const design = cloneDraft(get().draft);
        const id = makeId("cart");
        const item: CartItem = { id, design, price: calculatePrice(design), addedAt: new Date().toISOString() };
        set((state) => ({ cart: [item, ...state.cart] }));
        return id;
      },
      removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),
      updateCartQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) => {
          if (item.id !== id) return item;
          const design = { ...item.design, quantity: Math.max(5, quantity) };
          return { ...item, design, price: calculatePrice(design) };
        }),
      })),
      clearCart: () => set({ cart: [] }),
      addAddress: (data) => {
        const address = { ...data, id: makeId("address") };
        set((state) => ({ addresses: [address, ...state.addresses] }));
        return address;
      },
      createOrder: (address, paymentMethod, deliveryMethod) => {
        const cart = get().cart;
        if (!cart.length) return null;
        const primaryFamily = getMaterial(cart[0].design.materialId).family;
        const now = new Date();
        const id = makeId("order");
        const datePart = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
        const serial = String(Math.floor(1000 + Math.random() * 9000));
        const productionDays = primaryFamily === "paper" ? 5 : primaryFamily === "leather" ? 7 : 8;
        const eta = new Date(now);
        eta.setDate(eta.getDate() + productionDays);
        const total = cart.reduce((sum, item) => sum + item.price.total, 0) + (deliveryMethod === "express" ? 25 : 0);
        const order: Order = {
          id,
          number: `GH-${datePart}-${serial}`,
          createdAt: now.toISOString(),
          status: "received",
          items: cart,
          address,
          paymentMethod,
          deliveryMethod,
          total,
          estimatedDelivery: eta.toISOString().slice(0, 10),
        };
        set((state) => ({ orders: [order, ...state.orders], cart: [] }));
        return order;
      },
      resetDemo: () => set({ hasHydrated: true, ...initialData() }),
    }),
    {
      name: "ghallif-prototype-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ hasHydrated: _hasHydrated, ...state }) => state,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

export const demoCredentials = { email: demoUser.email, password: demoUser.password };
export const productionEstimate = (draft: DesignDraft) => getDeliveryWindow(getMaterial(draft.materialId).family);
