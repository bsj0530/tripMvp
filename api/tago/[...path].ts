import type { VercelRequest, VercelResponse } from "@vercel/node";

function getPathFromRequest(req: VercelRequest) {
  const rawPath = req.query.path;

  if (Array.isArray(rawPath)) {
    return rawPath.join("/");
  }

  if (typeof rawPath === "string" && rawPath) {
    return rawPath;
  }

  const url = req.url ?? "";
  const pathname = url.split("?")[0] ?? "";

  return pathname.replace(/^\/api\/tago\/?/, "");
}

function appendQueryParam(
  query: URLSearchParams,
  key: string,
  value: string | string[] | undefined,
) {
  if (value === undefined) return;

  if (Array.isArray(value)) {
    value.forEach((v) => query.append(key, String(v)));
    return;
  }

  query.set(key, String(value));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const serviceKey =
      process.env.TAGO_SERVICE_KEY ?? process.env.VITE_TAGO_SERVICE_KEY;

    if (!serviceKey) {
      return res.status(500).json({
        error: "TAGO_SERVICE_KEY가 설정되지 않았습니다.",
        hint: "Vercel Environment Variables에 TAGO_SERVICE_KEY 또는 VITE_TAGO_SERVICE_KEY를 추가하고 Redeploy 해주세요.",
        envKeys: Object.keys(process.env).filter((key) => key.includes("TAGO")),
      });
    }

    const path = getPathFromRequest(req);

    if (!path || path === "undefined") {
      return res.status(400).json({
        error: "TAGO API path가 없습니다.",
        url: req.url,
        query: req.query,
      });
    }

    const query = new URLSearchParams();

    Object.entries(req.query).forEach(([key, value]) => {
      if (key === "path") return;
      if (key === "serviceKey") return;

      appendQueryParam(query, key, value as string | string[] | undefined);
    });

    query.set("serviceKey", serviceKey);
    query.set("_type", "json");

    const apiUrl = `https://apis.data.go.kr/1613000/SuburbsBusInfo/${path}?${query.toString()}`;

    const response = await fetch(apiUrl);
    const text = await response.text();

    res.status(response.status);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.send(text);
  } catch (error) {
    return res.status(500).json({
      error: "시외버스 API 요청 중 오류가 발생했습니다.",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
