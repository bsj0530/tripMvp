import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const serviceKey = process.env.TAGO_SERVICE_KEY;

    if (!serviceKey) {
      return res.status(500).json({
        error: "TAGO_SERVICE_KEY가 설정되지 않았습니다.",
      });
    }

    const rawPath = req.query.path;
    const path = Array.isArray(rawPath) ? rawPath.join("/") : String(rawPath);

    const query = new URLSearchParams();

    Object.entries(req.query).forEach(([key, value]) => {
      if (key === "path") return;

      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)));
        return;
      }

      if (value !== undefined) {
        query.set(key, String(value));
      }
    });

    query.set("serviceKey", serviceKey);
    query.set("_type", "json");

    const response = await fetch(
      `https://apis.data.go.kr/1613000/SuburbsBusInfo/${path}?${query.toString()}`,
    );

    const text = await response.text();

    res.status(response.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(text);
  } catch (error) {
    return res.status(500).json({
      error: "시외버스 API 요청 중 오류가 발생했습니다.",
    });
  }
}
