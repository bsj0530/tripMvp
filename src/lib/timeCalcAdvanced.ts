import { sortByNearest } from "./routeSort";
import { getRouteTime } from "../api/kakaoNavi";

type Point = { lat: number; lng: number };

export async function getRealOrderResultAdvanced({
  cart,
  pickupTime,
  station,
}: {
  cart: any[];
  pickupTime: string;
  station: Point;
}) {
  const now = new Date();

  // 수령 시간
  const [h, m] = pickupTime.split(":").map(Number);
  const pickupDate = new Date();
  pickupDate.setHours(h, m, 0, 0);

  // 매장 좌표 (product.coords 필요)
  const shops: Point[] = cart.map((i) => i.product.coords);

  // 1) 방문 순서 (가까운 순)
  const sorted = sortByNearest(station, shops);

  // 2) 전체 경로
  const route = [station, ...sorted, station];

  // 3) 🚨 실제 이동 시간
  const moveMinutes = await getRouteTime(route);

  // 4) 매장 처리 시간 (간단 가정)
  const shopWork = shops.length * 5;

  const buffer = 10;

  const totalNeed = moveMinutes + shopWork + buffer;

  const deadline = new Date(pickupDate);
  deadline.setMinutes(deadline.getMinutes() - totalNeed);

  const canOrder = now <= deadline;

  return {
    canOrder,
    moveMinutes,
    totalNeed,
    deadline,
    route,
  };
}
