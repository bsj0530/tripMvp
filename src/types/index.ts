export type ScreenId =
  | "splash"
  | "signup"
  | "login"
  | "transport"
  | "home"
  | "category"
  | "products"
  | "product"
  | "cart"
  | "payment"
  | "tracking"
  | "pickup";

export interface Train {
  id: string;
  time: string;
  type: string;
  destination: string;
  duration: string;
}

export interface Bus {
  id: string;
  time: string;
  destination: string;
  duration: string;
  company: string;
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  address: string;
  phone?: string;
  image: string;

  lat: number;
  lng: number;

  distanceFromStation?: number;
  isOpen?: boolean;
}

export interface Product {
  id: string;
  shopId: string;
  shopName: string;

  // 🔥 추가
  category: string;
  categoryId: string;

  // 🔥 핵심 (Cart에서 사용)
  shopLat: number;
  shopLng: number;

  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type TransportType = "train" | "bus";

export interface TransportSelection {
  type: TransportType;
  id: string;
  time: string;
  destination: string;
  deadlineTime: string;
}

export interface OrderSchedule {
  departureTime: string;
  pickupTime: string;
  orderDeadlineTime: string;
}

export interface OrderEstimate {
  shopCount: number;
  pickupMinutes: number;
  deliveryMinutes: number;
  bufferMinutes: number;
  totalNeedMinutes: number;
  canOrder: boolean;
  message: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  serviceFee: number;
  status: OrderStatus;
  createdAt: string;
  pickupLocation: string;
  transportTime: string;
  transportType: TransportType;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivering"
  | "arrived"
  | "completed";

export interface TrackingStep {
  step: number;
  label: string;
  sub: string;
  done: boolean;
  active: boolean;
}
