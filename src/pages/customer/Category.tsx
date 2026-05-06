import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../../store/useStore";
import { mockShops } from "../../data/shops";
import { mockCategories } from "../../data/categories";
import NavBar from "../../components/NavBar";
import { getCoordsByAddress, type Coord } from "../../api/kakaoLocal";
import { getDistanceKm } from "../../lib/distance";
import type { Shop } from "../../types";

declare global {
  interface Window {
    kakao: any;
  }
}

const YEONGJU_STATION = {
  lat: 36.8106,
  lng: 128.6241,
};

const PAGE_SIZE = 10;

type DisplayShop = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  phone?: string;
  address: string;
  image: string;
  lat: number;
  lng: number;
  distanceFromStation?: number;
};

function convertMockShop(shop: Shop): DisplayShop {
  const lat = shop.lat ?? YEONGJU_STATION.lat;
  const lng = shop.lng ?? YEONGJU_STATION.lng;

  return {
    id: shop.id,
    name: shop.name,
    category: shop.category,
    categoryId: shop.categoryId,
    phone: shop.phone,
    address: shop.address,
    image: shop.image,
    lat,
    lng,
    distanceFromStation:
      shop.distanceFromStation ??
      getDistanceKm(YEONGJU_STATION.lat, YEONGJU_STATION.lng, lat, lng),
  };
}

export default function Category() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement | null>(null);

  const {
    selectedCategoryId,
    selectedTransport,
    orderSchedule,
    setSelectedShop,
  } = useStore();

  const [displayShops, setDisplayShops] = useState<DisplayShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const safeCategoryId = selectedCategoryId || "all";
  const category = mockCategories.find((c) => c.id === safeCategoryId);

  const mockFilteredShops = useMemo(() => {
    if (safeCategoryId === "all") return mockShops;
    return mockShops.filter((shop) => shop.categoryId === safeCategoryId);
  }, [safeCategoryId]);

  const visibleShops = displayShops.slice(0, visibleCount);
  const hasMore = visibleCount < displayShops.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [safeCategoryId]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        setLoading(true);

        const cache: Record<string, Coord> = JSON.parse(
          localStorage.getItem("coords-cache") || "{}",
        );

        const mockOnlyShops = await Promise.all(
          mockFilteredShops.map(async (shop): Promise<DisplayShop> => {
            const fallbackShop = convertMockShop(shop);

            let coords: Coord | null = cache[shop.address] ?? null;

            if (!coords) {
              coords = await getCoordsByAddress(shop.address);

              if (coords) {
                cache[shop.address] = coords;
              }
            }

            if (!coords) {
              return fallbackShop;
            }

            return {
              ...fallbackShop,
              lat: coords.lat,
              lng: coords.lng,
              distanceFromStation: getDistanceKm(
                YEONGJU_STATION.lat,
                YEONGJU_STATION.lng,
                coords.lat,
                coords.lng,
              ),
            };
          }),
        );

        localStorage.setItem("coords-cache", JSON.stringify(cache));

        const sorted = mockOnlyShops.sort(
          (a, b) =>
            (a.distanceFromStation ?? 9999) - (b.distanceFromStation ?? 9999),
        );

        setDisplayShops(sorted);
      } catch (error) {
        console.error("판매처 로딩 실패:", error);

        const fallback = mockFilteredShops
          .map((shop) => convertMockShop(shop))
          .sort(
            (a, b) =>
              (a.distanceFromStation ?? 9999) - (b.distanceFromStation ?? 9999),
          );

        setDisplayShops(fallback);
      } finally {
        setLoading(false);
      }
    };

    loadShops();
  }, [safeCategoryId, mockFilteredShops]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (loading) return;
    if (displayShops.length === 0) return;

    if (!window.kakao?.maps) {
      console.error("카카오맵 SDK가 로드되지 않았습니다.");
      return;
    }

    const kakao = window.kakao;

    const stationPosition = new kakao.maps.LatLng(
      YEONGJU_STATION.lat,
      YEONGJU_STATION.lng,
    );

    const map = new kakao.maps.Map(mapRef.current, {
      center: stationPosition,
      level: 7,
    });

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(stationPosition);

    new kakao.maps.Marker({
      map,
      position: stationPosition,
      title: "영주역",
    });

    new kakao.maps.CustomOverlay({
      map,
      position: stationPosition,
      yAnchor: 1.8,
      content: `
        <div style="
          padding:6px 10px;
          border-radius:999px;
          background:#111827;
          color:white;
          font-size:12px;
          font-weight:700;
          white-space:nowrap;
          box-shadow:0 2px 8px rgba(0,0,0,0.18);
        ">
          🚉 영주역
        </div>
      `,
    });

    displayShops.forEach((shop, index) => {
      const shopPosition = new kakao.maps.LatLng(shop.lat, shop.lng);
      bounds.extend(shopPosition);

      new kakao.maps.Marker({
        map,
        position: shopPosition,
        title: shop.name,
      });

      new kakao.maps.CustomOverlay({
        map,
        position: shopPosition,
        yAnchor: 2.2,
        content: `
          <div style="
            padding:6px 9px;
            border-radius:10px;
            background:white;
            border:1px solid #f59e0b;
            color:#92400e;
            font-size:11px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,0.12);
          ">
            ${index + 1}. ${shop.name}<br/>
            <span style="color:#f59e0b;">
              영주역에서 ${
                shop.distanceFromStation !== undefined
                  ? `${shop.distanceFromStation.toFixed(1)}km`
                  : "거리 정보 없음"
              }
            </span>
          </div>
        `,
      });
    });

    const nearestShop = displayShops[0];

    if (nearestShop) {
      const nearestPosition = new kakao.maps.LatLng(
        nearestShop.lat,
        nearestShop.lng,
      );

      new kakao.maps.Polyline({
        map,
        path: [stationPosition, nearestPosition],
        strokeWeight: 4,
        strokeColor: "#f59e0b",
        strokeOpacity: 0.85,
        strokeStyle: "solid",
      });

      const midLat = (YEONGJU_STATION.lat + nearestShop.lat) / 2;
      const midLng = (YEONGJU_STATION.lng + nearestShop.lng) / 2;

      new kakao.maps.CustomOverlay({
        map,
        position: new kakao.maps.LatLng(midLat, midLng),
        content: `
          <div style="
            padding:5px 9px;
            border-radius:999px;
            background:#f59e0b;
            color:white;
            font-size:11px;
            font-weight:800;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,0.16);
          ">
            가장 가까운 판매처 ${
              nearestShop.distanceFromStation !== undefined
                ? `${nearestShop.distanceFromStation.toFixed(1)}km`
                : ""
            }
          </div>
        `,
      });
    }

    map.setBounds(bounds);
  }, [loading, displayShops]);

  const handleShopClick = (shop: DisplayShop) => {
    setSelectedShop({
      id: shop.id,
      name: shop.name,
      category: shop.category,
      categoryId: shop.categoryId,
      address: shop.address,
      phone: shop.phone,
      image: shop.image,
      lat: shop.lat,
      lng: shop.lng,
      distanceFromStation: shop.distanceFromStation,
      isOpen: true,
    });

    navigate("/products");
  };

  return (
    <>
      <NavBar title={category?.name || "전체보기"} />

      <div className="px-5 pt-4 pb-6">
        {selectedTransport && orderSchedule && (
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800">
              {selectedTransport.destination}행 · {orderSchedule.departureTime}{" "}
              출발
            </p>

            <div className="mt-2 flex items-center justify-between text-[12px]">
              <span className="text-amber-800">
                추천 수령 {orderSchedule.pickupTime}
              </span>

              <span className="font-bold text-amber-900">
                주문 마감 {orderSchedule.orderDeadlineTime}
              </span>
            </div>
          </div>
        )}

        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          영주 특산물 판매처
        </span>

        {loading && (
          <div className="py-10 text-center text-sm text-gray-400">
            판매처를 불러오는 중...
          </div>
        )}

        {!loading && displayShops.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            해당 카테고리의 판매처가 없습니다.
          </div>
        )}

        {!loading && displayShops.length > 0 && (
          <>
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    영주역 기준 판매처 위치
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    등록된 판매처를 카카오맵에 표시합니다.
                  </p>
                </div>

                <div className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-600">
                  최근접 {displayShops[0]?.distanceFromStation?.toFixed(1)}km
                </div>
              </div>

              <div ref={mapRef} className="h-[260px] w-full bg-gray-100" />

              <div className="flex items-center justify-between px-4 py-3 text-[11px]">
                <span className="font-semibold text-gray-500">🚉 영주역</span>

                <span className="text-gray-400">
                  총 {displayShops.length}개 판매처 표시
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col">
              {visibleShops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => handleShopClick(shop)}
                  className="flex gap-3 border-b border-gray-100 py-3 text-left"
                >
                  <div className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-[28px]">
                    {shop.image}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-dark truncate text-sm font-semibold">
                      {shop.name}
                    </p>

                    <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-400">
                      {shop.category}
                    </p>

                    <p className="mt-1 text-[11px] text-amber-500">
                      {shop.phone || "전화번호 없음"}
                    </p>

                    <p className="mt-1 line-clamp-1 text-[11px] text-gray-400">
                      {shop.address}
                    </p>

                    <p className="text-primary mt-1 text-[11px] font-semibold">
                      {shop.distanceFromStation !== undefined
                        ? `영주역에서 ${shop.distanceFromStation.toFixed(1)}km`
                        : "거리 정보 없음"}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="mt-4 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600"
              >
                더보기
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
