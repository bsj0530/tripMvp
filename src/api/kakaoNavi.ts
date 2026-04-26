const KAKAO_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const cache = new Map<string, number>();

type Point = {
  lat: number;
  lng: number;
};

function keyOf(a: Point, b: Point) {
  return `${a.lat},${a.lng}->${b.lat},${b.lng}`;
}

export async function getRouteTime(points: Point[]) {
  if (!KAKAO_KEY) {
    console.error("VITE_KAKAO_REST_KEY가 .env에 없습니다.");
    return 0;
  }

  let totalSec = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const o = points[i];
    const d = points[i + 1];

    if (!o || !d) continue;

    const key = keyOf(o, d);

    if (cache.has(key)) {
      totalSec += cache.get(key)!;
      continue;
    }

    const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${o.lng},${o.lat}&destination=${d.lng},${d.lat}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `KakaoAK ${KAKAO_KEY}`,
        },
      });

      if (!res.ok) {
        console.error("카카오 내비 API 실패:", res.status, await res.text());
        continue;
      }

      const data = await res.json();

      const sec = data?.routes?.[0]?.summary?.duration ?? 0;

      cache.set(key, sec);
      totalSec += sec;
    } catch (error) {
      console.error("카카오 내비 요청 실패:", error);
    }
  }

  return Math.ceil(totalSec / 60);
}
