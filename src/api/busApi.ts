const TAGO_BASE_URL = import.meta.env.VITE_TAGO_BUS_BASE_URL || "/api/tago";
const TAGO_SERVICE_KEY = import.meta.env.VITE_TAGO_SERVICE_KEY;

export type BusItem = {
  id: string;
  time: string;
  destination: string;
  company: string;
  duration: string;
};

type TerminalItem = {
  terminalId: string;
  terminalNm: string;
};

const DESTINATION_KEYWORDS = ["동서울", "동대구", "대전", "안동", "구미"];

function getTodayYYYYMMDD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  return `${yyyy}${mm}${dd}`;
}

function formatTime(raw?: string) {
  if (!raw) return "";

  const value = String(raw);
  if (value.length < 12) return "";

  return `${value.slice(8, 10)}:${value.slice(10, 12)}`;
}

function calcDuration(dep?: string, arr?: string) {
  if (!dep || !arr) return "소요시간 정보 없음";

  const depValue = String(dep);
  const arrValue = String(arr);

  if (depValue.length < 12 || arrValue.length < 12) {
    return "소요시간 정보 없음";
  }

  const depDate = new Date(
    `${depValue.slice(0, 4)}-${depValue.slice(4, 6)}-${depValue.slice(
      6,
      8,
    )}T${depValue.slice(8, 10)}:${depValue.slice(10, 12)}:00`,
  );

  const arrDate = new Date(
    `${arrValue.slice(0, 4)}-${arrValue.slice(4, 6)}-${arrValue.slice(
      6,
      8,
    )}T${arrValue.slice(8, 10)}:${arrValue.slice(10, 12)}:00`,
  );

  const diffMin = Math.round((arrDate.getTime() - depDate.getTime()) / 60000);

  if (!Number.isFinite(diffMin) || diffMin <= 0) {
    return "소요시간 정보 없음";
  }

  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;

  return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
}

function toArray<T>(item: T | T[] | undefined | null): T[] {
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

async function requestJson<T>(path: string, params: Record<string, string>) {
  if (!TAGO_SERVICE_KEY) {
    throw new Error("VITE_TAGO_SERVICE_KEY가 없습니다.");
  }

  const query = new URLSearchParams({
    serviceKey: TAGO_SERVICE_KEY,
    _type: "json",
    ...params,
  });

  const url = `${TAGO_BASE_URL}${path}?${query}`;

  console.log("TAGO REQUEST URL:", url);

  const res = await fetch(url);
  const text = await res.text();

  if (!res.ok) {
    console.error("TAGO API ERROR:", res.status, text);
    throw new Error("시외버스 API 호출 실패");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("TAGO RAW RESPONSE:", text);
    throw new Error("시외버스 API 응답이 JSON이 아닙니다.");
  }
}

export async function getTerminalList(): Promise<TerminalItem[]> {
  const data: any = await requestJson("/GetSuberbsBusTrminlList", {
    numOfRows: "999",
    pageNo: "1",
  });

  const item = data?.response?.body?.items?.item;
  const list = toArray<any>(item);

  const terminals = list
    .map(
      (terminal): TerminalItem => ({
        terminalId: String(terminal.terminalId ?? terminal.terId ?? ""),
        terminalNm: String(terminal.terminalNm ?? terminal.terNm ?? ""),
      }),
    )
    .filter((terminal) => terminal.terminalId && terminal.terminalNm);

  console.log("전체 터미널 목록:", terminals);

  const targetTerminals = terminals.filter(
    (terminal) =>
      terminal.terminalNm.includes("영주") ||
      DESTINATION_KEYWORDS.some((keyword) =>
        terminal.terminalNm.includes(keyword),
      ),
  );

  console.log("찾은 터미널 후보:", targetTerminals);

  return terminals;
}

function findTerminalByKeyword(terminals: TerminalItem[], keyword: string) {
  return terminals.find((terminal) => terminal.terminalNm.includes(keyword));
}

async function getBusInfoByDestination(
  depTerminalId: string,
  arrTerminalId: string,
  arrTerminalNm: string,
  depPlandTime: string,
): Promise<BusItem[]> {
  const data: any = await requestJson("/GetStrtpntAlocFndSuberbsBusInfo", {
    numOfRows: "100",
    pageNo: "1",
    depTerminalId,
    arrTerminalId,
    depPlandTime,
  });

  console.log("BUS API RESPONSE:", data);
  console.log("BUS HEADER:", data?.response?.header);
  console.log("BUS BODY:", data?.response?.body);

  const resultCode = data?.response?.header?.resultCode;
  const resultMsg = data?.response?.header?.resultMsg;

  if (resultCode && resultCode !== "00") {
    console.warn("BUS API RESPONSE ERROR:", resultCode, resultMsg);
    return [];
  }

  const item = data?.response?.body?.items?.item;
  const list = toArray<any>(item);

  return list.map(
    (bus, index): BusItem => ({
      id: String(
        bus.arrPlandTime ??
          bus.depPlandTime ??
          `${depTerminalId}-${arrTerminalId}-${index}`,
      ),
      time: formatTime(bus.depPlandTime),
      destination: bus.arrTerminalNm ?? arrTerminalNm,
      company: bus.gradeNm ?? bus.charge ?? "시외버스",
      duration: calcDuration(bus.depPlandTime, bus.arrPlandTime),
    }),
  );
}

async function runInChunks<T, R>(
  items: T[],
  chunkSize: number,
  task: (item: T) => Promise<R>,
) {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const settled = await Promise.allSettled(chunk.map(task));

    settled.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      }
    });
  }

  return results;
}

export async function getSuburbsBusInfo(): Promise<BusItem[]> {
  const today = getTodayYYYYMMDD();

  const terminals = await getTerminalList();

  const yeongjuTerminal = findTerminalByKeyword(terminals, "영주");

  if (!yeongjuTerminal) {
    throw new Error("영주 터미널 ID를 찾지 못했습니다.");
  }

  const destinationTerminals = DESTINATION_KEYWORDS.map((keyword) =>
    findTerminalByKeyword(terminals, keyword),
  ).filter((terminal): terminal is TerminalItem => Boolean(terminal));

  console.log("영주 터미널:", yeongjuTerminal);
  console.log("도착 터미널:", destinationTerminals);

  const results = await runInChunks(destinationTerminals, 3, async (terminal) =>
    getBusInfoByDestination(
      yeongjuTerminal.terminalId,
      terminal.terminalId,
      terminal.terminalNm,
      today,
    ),
  );

  return results
    .flat()
    .filter((bus) => bus.time)
    .sort((a, b) => a.time.localeCompare(b.time));
}
