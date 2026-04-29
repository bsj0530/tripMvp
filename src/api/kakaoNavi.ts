const cache = new Map<string, number>();

type Point = {
  lat: number;
  lng: number;
};

function keyOf(a: Point, b: Point) {
  return `${a.lat},${a.lng}->${b.lat},${b.lng}`;
}

async function safeJson(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("JSON이 아닌 응답:", text.slice(0, 300));
    throw new Error("API 응답이 JSON이 아닙니다.");
  }
}

export async function getRouteTime(points: Point[]) {
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

    const query = new URLSearchParams({
      originLng: String(o.lng),
      originLat: String(o.lat),
      destinationLng: String(d.lng),
      destinationLat: String(d.lat),
    });

    try {
      const res = await fetch(`/api/kakao-route?${query}`);
      const data = await safeJson(res);

      if (!res.ok) {
        console.error("카카오 내비 API 실패:", data);
        continue;
      }

      const sec = data?.routes?.[0]?.summary?.duration ?? 0;

      cache.set(key, sec);
      totalSec += sec;
    } catch (error) {
      console.error("카카오 내비 요청 실패:", error);
    }
  }

  return Math.ceil(totalSec / 60);
}
