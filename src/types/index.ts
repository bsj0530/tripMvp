export type ScreenId =
  | 'splash'
  | 'signup'
  | 'login'
  | 'transport'
  | 'deadline'
  | 'home'
  | 'category'
  | 'product'
  | 'cart'
  | 'payment'
  | 'tracking'
  | 'pickup'

export interface Train {
  id: string
  time: string
  type: string
  destination: string
  duration: string
}

export interface Bus {
  id: string
  time: string
  destination: string
  duration: string
  company: string
}

export interface Shop {
  id: string
  name: string
  category: string
  categoryId: string
  address: string
  distanceFromStation: number
  rating: number
  isOpen: boolean
  openTime: string
  closeTime: string
  image: string
}

export interface Product {
  id: string
  shopId: string
  shopName: string
  name: string
  price: number
  description: string
  image: string
  rating: number
  isPickupOnly: boolean
  category: string
  categoryId: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  totalAmount: number
  serviceFee: number
  status: OrderStatus
  createdAt: string
  pickupLocation: string
  transportTime: string
  transportType: 'train' | 'bus'
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'arrived'
  | 'completed'

export interface TrackingStep {
  step: number
  label: string
  sub: string
  done: boolean
  active: boolean
}

export interface TransportSelection {
  type: 'train' | 'bus'
  id: string
  time: string
  destination: string
  deadlineTime: string
}
