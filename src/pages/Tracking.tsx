import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import { formatPrice } from "../store/useStore";
import { sortByNearest } from "../lib/routeSort";

const YEONGJU_STATION = {
  lat: 36.8106,
  lng: 128.6241,
};

type Point = {
  lat: number;
  lng: number;
};

type OrderItem = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    shopId: string;
    shopName: string;
    shopLat: number;
    shopLng: number;
  };
  quantity: number;
};

type CurrentOrder = {
  id: string;
  items: OrderItem[];
  cartTotal: number;
  serviceFee: number;
  finalTotal: number;
  estimate: {
    canOrder: boolean;
    message: string;
    totalNeedMinutes: number;
  };
  orderSchedule?: {
    departureTime: string;
    pickupTime: string;
    orderDeadlineTime: string;
  };
  selectedTransport?: {
    destination: string;
    time: string;
    type: "train" | "bus";
  };
  createdAt: string;
  pickupLocation: string;
};

export default function Tracking() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<CurrentOrder | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("current-order");

    if (!saved) return;

    try {
      setOrder(JSON.parse(saved));
    } catch {
      setOrder(null);
    }
  }, []);

  const sortedShops = useMemo(() => {
    if (!order) return [];

    const shops = order.items
      .map((item) => ({
        name: item.product.shopName,
        lat: item.product.shopLat,
        lng: item.product.shopLng,
      }))
      .filter(
        (shop) =>
          typeof shop.lat === "number" &&
          typeof shop.lng === "number" &&
          Number.isFinite(shop.lat) &&
          Number.isFinite(shop.lng),
      );

    const uniqueShops = Array.from(
      new Map(shops.map((shop) => [shop.name, shop])).values(),
    );

    const points = uniqueShops.map((shop) => ({
      lat: shop.lat,
      lng: shop.lng,
    }));

    const sortedPoints = sortByNearest(YEONGJU_STATION, points);

    return sortedPoints.map((point) => {
      return uniqueShops.find(
        (shop) => shop.lat === point.lat && shop.lng === point.lng,
      );
    });
  }, [order]);

  if (!order) {
    return (
      <>
        <NavBar title="배송 추적" />

        <div className="px-5 py-16 text-center">
          <p className="text-dark text-lg font-extrabold">
            주문 정보를 찾을 수 없어요
          </p>

          <p className="mt-2 text-sm text-gray-400">
            결제를 완료한 주문만 추적할 수 있습니다.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="bg-primary mt-6 rounded-xl px-5 py-3 text-sm font-bold text-white"
          >
            홈으로 가기
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar title="배송 추적" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">수령 동선 안내</h2>

        <p className="mt-1 text-sm text-gray-400">
          배달원이 매장을 방문한 뒤 영주역 수령 장소로 이동합니다.
        </p>

        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-800">수령 정보</p>

          <p className="mt-1 text-sm font-bold text-amber-900">
            {order.selectedTransport?.destination ?? "목적지"}행 ·{" "}
            {order.orderSchedule?.departureTime ?? "-"} 출발
          </p>

          <div className="mt-2 text-[12px] text-amber-800">
            <p>추천 수령: {order.orderSchedule?.pickupTime ?? "-"}</p>
            <p>주문 마감: {order.orderSchedule?.orderDeadlineTime ?? "-"}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-gray-50 p-4">
          <p className="text-dark text-sm font-bold">주문 상태</p>

          <div className="mt-4 flex flex-col gap-3">
            <TrackingStep
              label="주문 접수"
              sub="결제가 완료되어 주문이 접수되었습니다."
              active
              done
            />
            <TrackingStep
              label="매장 상품 준비"
              sub="각 매장에서 상품을 준비합니다."
              active
              done={false}
            />
            <TrackingStep
              label="배달원 픽업"
              sub="배달원이 매장을 순서대로 방문합니다."
              active={false}
              done={false}
            />
            <TrackingStep
              label="영주역 도착"
              sub="출발 전 수령 장소에서 상품을 전달합니다."
              active={false}
              done={false}
            />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-dark mb-3 text-sm font-extrabold">
            예상 방문 동선
          </p>

          <div className="flex flex-col gap-3">
            <RouteCard
              title="출발"
              name="영주역"
              sub="배달원 출발 기준 지점"
              index={0}
            />

            {sortedShops.map((shop, index) => (
              <RouteCard
                key={`${shop?.name}-${index}`}
                title={`${index + 1}번째 방문`}
                name={shop?.name ?? "매장"}
                sub={`위도 ${shop?.lat}, 경도 ${shop?.lng}`}
                index={index + 1}
              />
            ))}

            <RouteCard
              title="도착"
              name={order.pickupLocation || "영주역 수령 장소"}
              sub="고객 수령 위치"
              index={sortedShops.length + 1}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-dark text-sm font-extrabold">예상 소요 시간</p>

          <p className="mt-2 text-[13px] text-gray-500">
            총 필요 시간 {order.estimate.totalNeedMinutes}분
          </p>

          <p className="mt-1 text-[13px] text-gray-500">
            {order.estimate.message}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-dark mb-3 text-sm font-extrabold">주문 상품</p>

          <div className="flex flex-col gap-2">
            {order.items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-dark text-sm font-bold">
                    {item.product.image} {item.product.name}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    {item.product.shopName} · {item.quantity}개
                  </p>
                </div>

                <p className="text-dark text-sm font-bold">
                  {formatPrice(item.product.price * item.quantity)}원
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-dark text-sm font-bold">총 결제 금액</span>
              <span className="text-primary text-lg font-extrabold">
                {formatPrice(order.finalTotal)}원
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="bg-primary mt-5 w-full rounded-xl py-3.5 text-sm font-bold text-white"
        >
          홈으로 돌아가기
        </button>
      </div>
    </>
  );
}

function TrackingStep({
  label,
  sub,
  active,
  done,
}: {
  label: string;
  sub: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
          done
            ? "bg-primary text-white"
            : active
              ? "bg-amber-400 text-white"
              : "bg-gray-200 text-gray-400"
        }`}
      >
        {done ? "✓" : ""}
      </div>

      <div>
        <p className="text-dark text-sm font-bold">{label}</p>
        <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function RouteCard({
  title,
  name,
  sub,
  index,
}: {
  title: string;
  name: string;
  sub: string;
  index: number;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
      <div className="bg-primary flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
        {index}
      </div>

      <div>
        <p className="text-[11px] font-bold text-gray-400">{title}</p>
        <p className="text-dark mt-0.5 text-sm font-extrabold">{name}</p>
        <p className="mt-1 text-[11px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}
