import { useEffect, useMemo } from "react";
import NavBar from "../../components/NavBar";
import { formatPrice } from "../../store/useStore";
import {
  useDeliveryStore,
  type DeliveryOrderItem,
} from "../../store/deliveryStore";

export default function SellerOrders() {
  const { orders, hydrateOrders, updateOrderStatus } = useDeliveryStore();

  useEffect(() => {
    hydrateOrders();
  }, [hydrateOrders]);

  const shopGroups = useMemo(() => {
    const map = new Map<
      string,
      {
        shopId: string;
        shopName: string;
        items: DeliveryOrderItem[];
        orderId: string;
        pickupLocation: string;
        pickupTime: string;
        prepareDeadlineTime: string;
        deliveryArriveTime: string;
        riderName: string;
        riderVehicle: string;
      }
    >();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = `${order.id}-${item.shopId}`;

        if (!map.has(key)) {
          map.set(key, {
            shopId: item.shopId,
            shopName: item.shopName,
            items: [],
            orderId: order.id,
            pickupLocation: order.pickupLocation,
            pickupTime: order.pickupTime,
            prepareDeadlineTime: order.prepareDeadlineTime,
            deliveryArriveTime: order.deliveryArriveTime,
            riderName: order.rider.name,
            riderVehicle: order.rider.vehicle,
          });
        }

        map.get(key)?.items.push(item);
      });
    });

    return Array.from(map.values());
  }, [orders]);

  return (
    <>
      <NavBar title="매장 주문 내역" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">
          오늘 준비할 주문
        </h2>

        <p className="mt-1 text-[13px] text-gray-400">
          시간대별로 포장할 상품과 전달할 배달원을 확인하세요.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {shopGroups.map((group) => {
            const totalQuantity = group.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );

            const totalPrice = group.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
            );

            return (
              <div
                key={`${group.orderId}-${group.shopId}`}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-dark text-base font-extrabold">
                      {group.shopName}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      주문번호 {group.orderId}
                    </p>
                  </div>

                  <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    {group.pickupTime} 수령
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <p className="text-xs font-bold text-gray-500">
                    포장 마감 시간
                  </p>

                  <p className="text-primary mt-1 text-lg font-extrabold">
                    {group.prepareDeadlineTime}까지 준비
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {group.deliveryArriveTime}까지 {group.pickupLocation} 입고
                    예정
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-dark mb-2 text-sm font-extrabold">
                    포장 상품
                  </p>

                  <div className="flex flex-col gap-2">
                    {group.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2"
                      >
                        <div>
                          <p className="text-dark text-sm font-bold">
                            {item.productImage} {item.productName}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {item.quantity}개 포장
                          </p>
                        </div>

                        <p className="text-dark text-sm font-bold">
                          {formatPrice(item.price * item.quantity)}원
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-primary/10 bg-primary/5 mt-4 rounded-xl border p-3">
                  <p className="text-xs font-bold text-gray-500">전달 배달원</p>

                  <p className="text-dark mt-1 text-sm font-extrabold">
                    {group.riderName} 배달원 · {group.riderVehicle}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    포장 상품 총 {totalQuantity}개 / 예상 판매액{" "}
                    {formatPrice(totalPrice)}원
                  </p>
                </div>

                <button
                  onClick={() => updateOrderStatus(group.orderId, "READY")}
                  className="bg-primary mt-4 w-full rounded-xl py-3 text-sm font-bold text-white"
                >
                  포장 완료 처리
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
