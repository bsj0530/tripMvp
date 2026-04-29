export type GoodRestaurant = {
  REG_NO: number;
  BSSH_NM: string;
  TELNO: string;
  ADRES: string;
};

async function safeJson(res: Response) {
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("맛집 API JSON 아님:", text.slice(0, 300));
    throw new Error("영주맛집 API 응답이 JSON이 아닙니다.");
  }
}

export async function getGoodRestaurants(pageNo = 1, numOfRows = 100) {
  const url = `/api/good-restaurant?pageNo=${pageNo}&numOfRows=${numOfRows}`;

  const res = await fetch(url);
  const data = await safeJson(res);

  if (!res.ok) {
    console.error("맛집 API 응답:", data);
    throw new Error(`영주맛집 API 요청 실패: ${res.status}`);
  }

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
