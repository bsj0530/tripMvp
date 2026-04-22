import { create } from 'zustand'
import type { ScreenId, CartItem, TransportSelection, Product } from '../types'

interface AppState {
  // Navigation
  screen: ScreenId
  history: ScreenId[]
  navigate: (screen: ScreenId) => void
  goBack: () => void

  // Auth (mock)
  isLoggedIn: boolean
  setLoggedIn: (v: boolean) => void

  // Transport
  transportType: 'train' | 'bus'
  setTransportType: (t: 'train' | 'bus') => void
  selectedTransport: TransportSelection | null
  setSelectedTransport: (t: TransportSelection) => void

  // Shopping
  selectedCategoryId: string
  setSelectedCategoryId: (id: string) => void
  selectedProductId: string | null
  setSelectedProductId: (id: string | null) => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getServiceFee: () => number

  // Order
  orderId: string | null
  setOrderId: (id: string | null) => void
}

export const useStore = create<AppState>((set, get) => ({
  // Navigation
  screen: 'splash',
  history: ['splash'],
  navigate: (screen) =>
    set((s) => ({ screen, history: [...s.history, screen] })),
  goBack: () =>
    set((s) => {
      const newHistory = s.history.slice(0, -1)
      return {
        history: newHistory,
        screen: newHistory[newHistory.length - 1] || 'splash',
      }
    }),

  // Auth
  isLoggedIn: false,
  setLoggedIn: (v) => set({ isLoggedIn: v }),

  // Transport
  transportType: 'train',
  setTransportType: (t) => set({ transportType: t }),
  selectedTransport: null,
  setSelectedTransport: (t) => set({ selectedTransport: t }),

  // Shopping
  selectedCategoryId: 'bread',
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  selectedProductId: null,
  setSelectedProductId: (id) => set({ selectedProductId: id }),

  // Cart
  cart: [],
  addToCart: (product, quantity) =>
    set((s) => {
      const existing = s.cart.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          cart: s.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      }
      return { cart: [...s.cart, { product, quantity }] }
    }),
  removeFromCart: (productId) =>
    set((s) => ({
      cart: s.cart.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((s) => {
      if (quantity <= 0) {
        return { cart: s.cart.filter((item) => item.product.id !== productId) }
      }
      return {
        cart: s.cart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      }
    }),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () =>
    get().cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),
  getServiceFee: () => 2000,

  // Order
  orderId: null,
  setOrderId: (id) => set({ orderId: id }),
}))

export function calculateDeadline(departureTime: string): string {
  const [hours, minutes] = departureTime.split(':').map(Number)
  let deadlineHours = hours - 1
  if (deadlineHours < 0) deadlineHours = 23
  return `${String(deadlineHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR')
}
