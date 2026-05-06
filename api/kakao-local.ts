import type { VercelRequest, VercelResponse } from "@vercel/node";

const KAKAO_LOCAL_BASE_URL = "https://dapi.kakao.com/v2/local";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const serviceKey = process.env.KAKAO_REST_API_KEY;

    if (!serviceKey) {
      return res.status(500).json({
        error: "KAKAO_REST_API_KEY가 설정되지 않았습니다.",
      });
    }

    const { type, query, address, size = "15" } = req.query;

    let kakaoUrl = "";

    if (type === "keyword") {
      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "키워드 검색에는 query가 필요합니다.",
        });
      }

      kakaoUrl = `${KAKAO_LOCAL_BASE_URL}/search/keyword.json?query=${encodeURIComponent(
        query,
      )}&size=${size}`;
    } else if (type === "address") {
      const addressQuery = address || query;

      if (!addressQuery || typeof addressQuery !== "string") {
        return res.status(400).json({
          error: "주소 검색에는 address 또는 query가 필요합니다.",
        });
      }

      kakaoUrl = `${KAKAO_LOCAL_BASE_URL}/search/address.json?query=${encodeURIComponent(
        addressQuery,
      )}&size=${size}`;
    } else {
      return res.status(400).json({
        error: "type은 keyword 또는 address여야 합니다.",
      });
    }

    const kakaoResponse = await fetch(kakaoUrl, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${serviceKey}`,
      },
    });

    const data = await kakaoResponse.json();

    if (!kakaoResponse.ok) {
      return res.status(kakaoResponse.status).json({
        error: "카카오 로컬 API 요청 실패",
        detail: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("카카오 로컬 API 서버 오류:", error);

    return res.status(500).json({
      error: "카카오 로컬 API 서버 오류",
    });
  }
}
