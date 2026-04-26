export type ScreenId =
  | "splash"
  | "signup"
  | "login"
  | "transport"
  | "deadline"
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

  // 🔥 추가 (필수)
  lat: number;
  lng: number;

  distanceFromStation?: number;
  rating?: number;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
  image: string;
}
export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  isPickupOnly: boolean;
  category: string;
  categoryId: string;
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

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  serviceFee: number;
  status: OrderStatus;
  createdAt: string;
  pickupLocation: string;
  transportTime: string;
  transportType: "train" | "bus";
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

export interface TransportSelection {
  type: "train" | "bus";
  id: string;
  time: string;
  destination: string;
  deadlineTime: string;
}

export const mockShops: Shop[] = [
  {
    id: "yeongju-station",
    categoryId: "all",
    category: "전체보기",
    name: "영주역 특산물 직판장",
    phone: "054-632-7684",
    address: "경상북도 영주시 선비로 64",
    image: "🏪",

    // 🔥 추가
    lat: 36.8106,
    lng: 128.6241,
  },
  {
    id: "jung-donut",
    categoryId: "bread",
    category: "빵·디저트",
    name: "정도너츠 본점",
    phone: "054-636-0067",
    address: "경상북도 영주시 풍기읍 동성로 94",
    image: "🍩",

    lat: 36.8215,
    lng: 128.6195,
  },
  {
    id: "yeongju-wine",
    categoryId: "drink",
    category: "전통주",
    name: "(주)영주와인",
    phone: "054-635-6533",
    address: "경상북도 영주시 풍기읍 안풍로 307-12",
    image: "🍷",

    lat: 36.827,
    lng: 128.6265,
  },
  {
    id: "jeunette",
    categoryId: "drink",
    category: "전통주",
    name: "쥬네뜨 공장",
    phone: "054-633-5316",
    address: "경상북도 영주시 단산면",
    image: "🍇",

    lat: 36.8,
    lng: 128.61,
  },
  {
    id: "punggi-market",
    categoryId: "ginseng",
    category: "인삼·건강",
    name: "풍기온천농특산물직판장",
    phone: "054-636-2921",
    address: "경상북도 영주시 풍기읍 죽령로 1400",
    image: "🌿",

    lat: 36.8295,
    lng: 128.615,
  },
];
