const BASE = "/api/kakao-local";

export type Coord = {
  lat: number;
  lng: number;
};

export type KakaoPlace = {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
};

async function safeJson(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("JSON이 아닌 응답:", text.slice(0, 300));
    throw new Error("API 응답이 JSON이 아닙니다.");
  }
}

export async function getCoordsByAddress(
  address: string,
): Promise<Coord | null> {
  const res = await fetch(
    `${BASE}?type=address&query=${encodeURIComponent(address)}`,
  );

  const data = await safeJson(res);

  if (!res.ok) {
    console.error("카카오 주소검색 실패:", data);
    throw new Error("카카오 주소검색 API 실패");
  }

  const doc = data.documents?.[0];
  if (!doc) return null;

  return {
    lat: Number(doc.y),
    lng: Number(doc.x),
  };
}

export async function searchPlaces(keyword: string): Promise<KakaoPlace[]> {
  const res = await fetch(
    `${BASE}?type=keyword&query=${encodeURIComponent(keyword)}&size=15`,
  );

  const data = await safeJson(res);

  if (!res.ok) {
    console.error("카카오 키워드 검색 실패:", data);
    throw new Error("카카오 키워드 검색 API 실패");
  }

  return data.documents ?? [];
}
