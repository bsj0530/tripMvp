import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStore, calculateDeadline } from "../store/useStore";
import NavBar from "../components/NavBar";
import { yeongjuTrains } from "../data/yeongjuTrains";
import { getSuburbsBusInfo, type BusItem } from "../api/busApi";

export default function Transport() {
  const navigate = useNavigate();
  const { transportType, setTransportType, setSelectedTransport } = useStore();

  const [buses, setBuses] = useState<BusItem[]>([]);
  const [isBusLoading, setIsBusLoading] = useState(false);
  const [busErrorMessage, setBusErrorMessage] = useState("");

  useEffect(() => {
    if (transportType !== "bus") return;

    const fetchBuses = async () => {
      try {
        setIsBusLoading(true);
        setBusErrorMessage("");

        const data = await getSuburbsBusInfo();

        console.log("BUS DATA:", data); // 🔥 디버깅

        setBuses(data);
      } catch (error) {
        console.error("BUS FETCH ERROR:", error);

        setBusErrorMessage(
          error instanceof Error
            ? error.message
            : "시외버스 운행정보를 불러오지 못했습니다.",
        );
      } finally {
        setIsBusLoading(false);
      }
    };

    fetchBuses();
  }, [transportType]);

  const handleSelect = (id: string, time: string, dest: string) => {
    setSelectedTransport({
      type: transportType,
      id,
      time,
      destination: dest,
      deadlineTime: calculateDeadline(time),
    });

    navigate("/deadline");
  };

  return (
    <>
      <NavBar title="귀가편 선택" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">
          귀가 교통편 선택
        </h2>

        <p className="mb-1.5 text-[13px] text-gray-400">
          돌아가실 교통편을 먼저 알려주세요
        </p>

        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          열차(JSON) + 시외버스(API)
        </span>

        {/* 교통수단 선택 */}
        <div className="mt-5 mb-5 flex gap-2.5">
          <button
            onClick={() => setTransportType("train")}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold ${
              transportType === "train"
                ? "bg-dark text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            🚂 열차
          </button>

          <button
            onClick={() => setTransportType("bus")}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold ${
              transportType === "bus"
                ? "bg-dark text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            🚌 시외버스
          </button>
        </div>

        {/* 제목 */}
        <p className="mb-2 text-xs font-semibold text-gray-500">
          {transportType === "train"
            ? "영주역 출발 열차"
            : "영주시외버스터미널 출발"}
        </p>

        <div className="flex flex-col gap-2">
          {/* 🚂 열차 */}
          {transportType === "train" &&
            yeongjuTrains.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id, t.time, t.destination)}
                className="hover:border-primary flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-3 hover:bg-red-50"
              >
                <div className="text-left">
                  <p className="text-lg font-extrabold">{t.time}</p>
                  <p className="text-[11px] text-gray-400">
                    {t.type} · {t.duration}
                  </p>
                </div>

                <p className="text-[13px] text-gray-500">{t.destination}</p>
              </button>
            ))}

          {transportType === "train" && yeongjuTrains.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">
              열차 데이터 없음 (JSON 확인 필요)
            </p>
          )}

          {/* 🚌 로딩 */}
          {transportType === "bus" && isBusLoading && (
            <p className="py-6 text-center text-sm text-gray-400">
              버스 정보 불러오는 중...
            </p>
          )}

          {/* 🚌 에러 */}
          {transportType === "bus" && busErrorMessage && (
            <p className="py-6 text-center text-sm text-red-500">
              {busErrorMessage}
            </p>
          )}

          {/* 🚌 데이터 */}
          {transportType === "bus" &&
            !isBusLoading &&
            !busErrorMessage &&
            buses.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelect(b.id, b.time, b.destination)}
                className="hover:border-primary flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-3 hover:bg-red-50"
              >
                <div className="text-left">
                  <p className="text-lg font-extrabold">{b.time}</p>
                  <p className="text-[11px] text-gray-400">
                    {b.company} · {b.duration}
                  </p>
                </div>

                <p className="text-[13px] text-gray-500">{b.destination}</p>
              </button>
            ))}

          {/* 🚌 빈 데이터 */}
          {transportType === "bus" &&
            !isBusLoading &&
            !busErrorMessage &&
            buses.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                버스 데이터 없음 (터미널 ID 문제 가능)
              </p>
            )}
        </div>
      </div>
    </>
  );
}
