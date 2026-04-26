import { getDistanceKm } from "./distance";

type Point = { lat: number; lng: number };

function isValid(p: any): p is Point {
  return (
    p &&
    typeof p.lat === "number" &&
    typeof p.lng === "number" &&
    Number.isFinite(p.lat) &&
    Number.isFinite(p.lng)
  );
}

export function sortByNearest(start: Point, shops: Point[]) {
  const result: Point[] = [];

  // ✅ 여기서 필터링
  const remaining = shops.filter(isValid);

  let current = start;

  while (remaining.length) {
    let bestIdx = 0;
    let min = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const target = remaining[i];

      // 🔥 혹시라도 방어
      if (!isValid(target)) continue;

      const d = getDistanceKm(current.lat, current.lng, target.lat, target.lng);

      if (d < min) {
        min = d;
        bestIdx = i;
      }
    }

    const next = remaining.splice(bestIdx, 1)[0];

    if (!isValid(next)) continue;

    result.push(next);
    current = next;
  }

  return result;
}
