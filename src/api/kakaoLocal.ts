const KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
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

export async function getCoordsByAddress(
  address: string,
): Promise<Coord | null> {
  const res = await fetch(
    `${BASE}/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    {
      headers: {
        Authorization: `KakaoAK ${KEY}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) throw new Error("카카오 주소검색 API 실패");

  const doc = data.documents?.[0];
  if (!doc) return null;

  return {
    lat: Number(doc.y),
    lng: Number(doc.x),
  };
}

export async function searchPlaces(keyword: string): Promise<KakaoPlace[]> {
  const res = await fetch(
    `${BASE}/v2/local/search/keyword.json?query=${encodeURIComponent(
      keyword,
    )}&size=15`,
    {
      headers: {
        Authorization: `KakaoAK ${KEY}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("카카오 키워드 검색 실패:", data);
    throw new Error("카카오 키워드 검색 API 실패");
  }

  return data.documents ?? [];
}
