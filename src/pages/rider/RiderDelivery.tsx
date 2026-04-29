import { useEffect, useMemo } from "react";
import NavBar from "../../components/NavBar";
import { useDeliveryStore } from "../../store/deliveryStore";
import { sortByNearest } from "../../lib/routeSort";

const YEONGJU_STATION = {
  lat: 36.8106,
  lng: 128.6241,
};

type RoutePoint = {
  name: string;
  lat: number;
  lng: number;
};

export default function RiderDelivery() {
  const { orders, hydrateOrders, updateOrderStatus } = useDeliveryStore();

  useEffect(() => {
    hydrateOrders();
  }, [hydrateOrders]);

  const order = orders[0];

  const routePoints = useMemo(() => {
    if (!order) return [];

    const shops: RoutePoint[] = order.items.map((item) => ({
      name: item.shopName,
      lat: item.shopLat,
      lng: item.shopLng,
    }));

    const uniqueShops = Array.from(
      new Map(shops.map((shop) => [shop.name, shop])).values(),
    );

    const sortedPoints = sortByNearest(
      YEONGJU_STATION,
      uniqueShops.map((shop) => ({
        lat: shop.lat,
        lng: shop.lng,
      })),
    );

    return sortedPoints
      .map((point) =>
        uniqueShops.find(
          (shop) => shop.lat === point.lat && shop.lng === point.lng,
        ),
      )
      .filter(Boolean) as RoutePoint[];
  }, [order]);

  if (!order) {
    return (
      <>
        <NavBar title="배달 코스" />

        <div className="px-5 py-16 text-center">
          <p className="text-dark text-lg font-extrabold">
            배정된 배송이 없어요
          </p>

          <p className="mt-2 text-sm text-gray-400">
            주문이 들어오면 배송 코스가 표시됩니다.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar title="배달 코스" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">
          {order.pickupTime} 픽업 배송
        </h2>

        <p className="mt-1 text-[13px] text-gray-400">
          매장을 순서대로 방문한 뒤 {order.pickupLocation}에 입고하세요.
        </p>

        <div className="border-primary/10 bg-primary/5 mt-5 rounded-2xl border p-4">
          <p className="text-xs font-bold text-gray-500">배정 배달원</p>

          <p className="text-dark mt-1 text-lg font-extrabold">
            {order.rider.name} · {order.rider.vehicle}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {order.deliveryArriveTime}까지 {order.pickupLocation} 입고
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-gray-50 p-4">
          <p className="text-dark mb-3 text-sm font-extrabold">오늘의 코스</p>

          <div className="flex flex-col gap-3">
            <RouteCard
              index={1}
              time={getVisitTime(0, order.prepareDeadlineTime)}
              title="출발"
              name="영주역 인근 출발"
              description="배송 시작 전 상품 수거 준비"
            />

            {routePoints.map((shop, index) => (
              <RouteCard
                key={shop.name}
                index={index + 2}
                time={getVisitTime(index + 1, order.prepareDeadlineTime)}
                title={`${index + 1}번째 매장 방문`}
                name={shop.name}
                description="상품 수량 확인 후 수거 완료 처리"
              />
            ))}

            <RouteCard
              index={routePoints.length + 2}
              time={order.deliveryArriveTime}
              title="도착"
              name={order.pickupLocation}
              description="픽업존 직원에게 상품 전달 후 입고 완료"
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-dark mb-3 text-sm font-extrabold">수거 상품</p>

          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className="text-dark text-sm font-bold">
                    {item.productImage} {item.productName}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {item.shopName}
                  </p>
                </div>

                <p className="text-primary text-sm font-extrabold">
                  {item.quantity}개
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => updateOrderStatus(order.id, "PICKED_UP")}
            className="rounded-xl bg-amber-400 py-3 text-sm font-bold text-white"
          >
            수거 완료
          </button>

          <button
            onClick={() => updateOrderStatus(order.id, "ARRIVED_PICKUP_ZONE")}
            className="bg-primary rounded-xl py-3 text-sm font-bold text-white"
          >
            입고 완료
          </button>
        </div>
      </div>
    </>
  );
}

function RouteCard({
  index,
  time,
  title,
  name,
  description,
}: {
  index: number;
  time: string;
  title: string;
  name: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="bg-primary flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
        {index}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold text-gray-400">{title}</p>
            <p className="text-dark mt-0.5 text-sm font-extrabold">{name}</p>
          </div>

          <p className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500">
            {time}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function getVisitTime(index: number, prepareDeadlineTime: string) {
  const [hourText, minuteText] = prepareDeadlineTime.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  const totalMinutes = hour * 60 + minute + index * 10;

  const nextHour = Math.floor(totalMinutes / 60);
  const nextMinute = totalMinutes % 60;

  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(
    2,
    "0",
  )}`;
}
