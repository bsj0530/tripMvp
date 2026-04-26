export type GoodRestaurant = {
  REG_NO: number;
  BSSH_NM: string;
  TELNO: string;
  ADRES: string;
};

const SERVICE_KEY = import.meta.env.VITE_GOOD_RESTAURANT_SERVICE_KEY;
const BASE_URL = import.meta.env.VITE_GOOD_RESTAURANT_BASE_URL;

export async function getGoodRestaurants(pageNo = 1, numOfRows = 100) {
  const url = `${BASE_URL}/getGoodRestaurantStatus?serviceKey=${SERVICE_KEY}&pageNo=${pageNo}&numOfRows=${numOfRows}&_type=json`;

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    console.error("맛집 API 응답 원문:", text);
    throw new Error(`영주맛집 API 요청 실패: ${res.status}`);
  }

  const data = JSON.parse(text);

  const body = data?.response?.body;
  const item = body?.items?.item;

  const restaurants: GoodRestaurant[] = Array.isArray(item)
    ? item
    : item
      ? [item]
      : [];

  return {
    restaurants,
    totalCount: body?.totalCount ?? restaurants.length,
    pageNo: body?.pageNo ?? pageNo,
    numOfRows: body?.numOfRows ?? numOfRows,
  };
}
