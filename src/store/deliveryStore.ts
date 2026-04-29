import { create } from "zustand";

export type DeliveryStatus =
  | "ORDER_RECEIVED"
  | "PREPARING"
  | "READY"
  | "RIDER_ASSIGNED"
  | "PICKED_UP"
  | "ARRIVED_PICKUP_ZONE"
  | "COMPLETED";

export type Rider = {
  id: string;
  name: string;
  phone: string;
  vehicle: "도보" | "자전거" | "오토바이" | "자차";
};

export type DeliveryOrderItem = {
  productId: string;
  productName: string;
  productImage: string;
  shopId: string;
  shopName: string;
  shopLat: number;
  shopLng: number;
  quantity: number;
  price: number;
};

export type DeliveryOrder = {
  id: string;
  pickupLocation: string;
  pickupTime: string;
  orderDeadlineTime: string;
  prepareDeadlineTime: string;
  deliveryArriveTime: string;
  finalTotal: number;
  items: DeliveryOrderItem[];
  rider: Rider;
  status: DeliveryStatus;
  createdAt: string;
};

type DeliveryState = {
  orders: DeliveryOrder[];
  hydrateOrders: () => void;
  updateOrderStatus: (orderId: string, status: DeliveryStatus) => void;
};

const DEMO_RIDER: Rider = {
  id: "rider-001",
  name: "김영수",
  phone: "010-2222-3333",
  vehicle: "자차",
};

const STORAGE_KEY = "delivery-orders";

function getTimeInfo(pickupTime?: string) {
  const normalized = pickupTime ?? "11:00";

  if (normalized.includes("11")) {
    return {
      pickupTime: "11:00",
      orderDeadlineTime: "09:30",
      prepareDeadlineTime: "10:00",
      deliveryArriveTime: "10:30",
    };
  }

  if (normalized.includes("15") || normalized.includes("3")) {
    return {
      pickupTime: "15:00",
      orderDeadlineTime: "13:30",
      prepareDeadlineTime: "14:00",
      deliveryArriveTime: "14:30",
    };
  }

  return {
    pickupTime: "20:00",
    orderDeadlineTime: "18:30",
    prepareDeadlineTime: "19:00",
    deliveryArriveTime: "19:30",
  };
}

function createDemoOrderFromCurrentOrder(): DeliveryOrder | null {
  const saved = localStorage.getItem("current-order");

  if (!saved) {
    return createFallbackDemoOrder();
  }

  try {
    const currentOrder = JSON.parse(saved);

    const timeInfo = getTimeInfo(currentOrder.orderSchedule?.pickupTime);

    return {
      id: currentOrder.id ?? `ORD-${Date.now()}`,
      pickupLocation: currentOrder.pickupLocation ?? "영주역 픽업존",
      pickupTime: timeInfo.pickupTime,
      orderDeadlineTime: timeInfo.orderDeadlineTime,
      prepareDeadlineTime: timeInfo.prepareDeadlineTime,
      deliveryArriveTime: timeInfo.deliveryArriveTime,
      finalTotal: currentOrder.finalTotal ?? 0,
      rider: DEMO_RIDER,
      status: "RIDER_ASSIGNED",
      createdAt: currentOrder.createdAt ?? new Date().toISOString(),
      items:
        currentOrder.items?.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          shopId: item.product.shopId,
          shopName: item.product.shopName,
          shopLat: item.product.shopLat,
          shopLng: item.product.shopLng,
          quantity: item.quantity,
          price: item.product.price,
        })) ?? [],
    };
  } catch {
    return createFallbackDemoOrder();
  }
}

function createFallbackDemoOrder(): DeliveryOrder {
  return {
    id: "ORD-DEMO-001",
    pickupLocation: "영주역 픽업존",
    pickupTime: "11:00",
    orderDeadlineTime: "09:30",
    prepareDeadlineTime: "10:00",
    deliveryArriveTime: "10:30",
    finalTotal: 42000,
    rider: DEMO_RIDER,
    status: "RIDER_ASSIGNED",
    createdAt: new Date().toISOString(),
    items: [
      {
        productId: "bread-001",
        productName: "영주 사과빵 세트",
        productImage: "🍎",
        shopId: "shop-bread",
        shopName: "영주 사과빵집",
        shopLat: 36.8121,
        shopLng: 128.6224,
        quantity: 2,
        price: 12000,
      },
      {
        productId: "ricecake-001",
        productName: "인절미 선물세트",
        productImage: "🍡",
        shopId: "shop-ricecake",
        shopName: "영주 전통떡집",
        shopLat: 36.8152,
        shopLng: 128.6199,
        quantity: 1,
        price: 18000,
      },
    ],
  };
}

function saveOrders(orders: DeliveryOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  orders: [],

  hydrateOrders: () => {
    const savedOrders = localStorage.getItem(STORAGE_KEY);

    if (savedOrders) {
      try {
        set({ orders: JSON.parse(savedOrders) });
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const demoOrder = createDemoOrderFromCurrentOrder();

    if (!demoOrder) return;

    const orders = [demoOrder];
    saveOrders(orders);
    set({ orders });
  },

  updateOrderStatus: (orderId, status) => {
    const updated = get().orders.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    );

    saveOrders(updated);
    set({ orders: updated });
  },
}));
