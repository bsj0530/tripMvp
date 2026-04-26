import { create } from "zustand";
import type {
  ScreenId,
  CartItem,
  TransportSelection,
  Product,
  Shop,
  TransportType,
  OrderSchedule,
  OrderEstimate,
} from "../types";

interface AppState {
  // Navigation
  screen: ScreenId;
  history: ScreenId[];
  navigate: (screen: ScreenId) => void;
  goBack: () => void;

  // Auth
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;

  // Transport
  transportType: TransportType;
  setTransportType: (t: TransportType) => void;

  selectedTransport: TransportSelection | null;
  setSelectedTransport: (t: TransportSelection | null) => void;

  orderSchedule: OrderSchedule | null;
  setOrderSchedule: (schedule: OrderSchedule | null) => void;

  // Shopping
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;

  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;

  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getServiceFee: () => number;
  getOrderEstimate: () => OrderEstimate;

  // Order
  orderId: string | null;
  setOrderId: (id: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  screen: "splash",
  history: ["splash"],

  navigate: (screen) =>
    set((s) => ({
      screen,
      history: [...s.history, screen],
    })),

  goBack: () =>
    set((s) => {
      const newHistory = s.history.slice(0, -1);

      return {
        history: newHistory,
        screen: newHistory[newHistory.length - 1] || "splash",
      };
    }),

  // Auth
  isLoggedIn: false,
  setLoggedIn: (v) => set({ isLoggedIn: v }),

  // Transport
  transportType: "train",
  setTransportType: (t) =>
    set({
      transportType: t,
      selectedTransport: null,
      orderSchedule: null,
    }),

  selectedTransport: null,
  setSelectedTransport: (t) => set({ selectedTransport: t }),

  orderSchedule: null,
  setOrderSchedule: (schedule) => set({ orderSchedule: schedule }),

  // Shopping
  selectedCategoryId: "bread",
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),

  selectedShop: null,
  setSelectedShop: (shop) => set({ selectedShop: shop }),

  selectedProductId: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),

  // Cart
  cart: [],

  addToCart: (product, quantity) =>
    set((s) => {
      const existing = s.cart.find((item) => item.product.id === product.id);

      if (existing) {
        return {
          cart: s.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
        };
      }

      return {
        cart: [...s.cart, { product, quantity }],
      };
    }),

  removeFromCart: (productId) =>
    set((s) => ({
      cart: s.cart.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((s) => {
      if (quantity <= 0) {
        return {
          cart: s.cart.filter((item) => item.product.id !== productId),
        };
      }

      return {
        cart: s.cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      };
    }),

  clearCart: () => set({ cart: [] }),

  getCartTotal: () =>
    get().cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),

  getServiceFee: () => 2000,

  getOrderEstimate: () => {
    const { cart, orderSchedule } = get();

    const shopCount = new Set(cart.map((item) => item.product.shopId)).size;

    const pickupMinutes = shopCount * 8;
    const deliveryMinutes = 15;
    const bufferMinutes = 10;
    const totalNeedMinutes = pickupMinutes + deliveryMinutes + bufferMinutes;

    if (!orderSchedule) {
      return {
        shopCount,
        pickupMinutes,
        deliveryMinutes,
        bufferMinutes,
        totalNeedMinutes,
        canOrder: false,
        message: "수령 시간이 설정되지 않았어요.",
      };
    }

    const now = new Date();
    const today = new Date();

    const [pickupHour, pickupMinute] = orderSchedule.pickupTime
      .split(":")
      .map(Number);

    const pickupDate = new Date(today);
    pickupDate.setHours(pickupHour, pickupMinute, 0, 0);

    const latestOrderTime = new Date(pickupDate);
    latestOrderTime.setMinutes(latestOrderTime.getMinutes() - totalNeedMinutes);

    const canOrder = now <= latestOrderTime;

    return {
      shopCount,
      pickupMinutes,
      deliveryMinutes,
      bufferMinutes,
      totalNeedMinutes,
      canOrder,
      message: canOrder ? "시간 내 수령 가능해요." : "시간 내 수령이 어려워요.",
    };
  },

  // Order
  orderId: null,
  setOrderId: (id) => set({ orderId: id }),
}));

export function calculateDeadline(departureTime: string): string {
  const [hours, minutes] = departureTime.split(":").map(Number);

  let deadlineHours = hours - 1;

  if (deadlineHours < 0) {
    deadlineHours = 23;
  }

  return `${String(deadlineHours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

export function calculatePickupTime(departureTime: string): string {
  const [hours, minutes] = departureTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() - 20);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

export function calculateOrderDeadlineTime(pickupTime: string): string {
  const [hours, minutes] = pickupTime.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() - 60);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}
