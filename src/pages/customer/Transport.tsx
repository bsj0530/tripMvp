import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  useStore,
  calculateDeadline,
  calculatePickupTime,
  calculateOrderDeadlineTime,
} from "../../store/useStore";
import NavBar from "../../components/NavBar";
import { yeongjuTrains } from "../../data/yeongjuTrains";
import { getSuburbsBusInfo, type BusItem } from "../../api/busApi";

export default function Transport() {
  const navigate = useNavigate();

  const {
    transportType,
    setTransportType,
    selectedTransport,
    setSelectedTransport,
    orderSchedule,
    setOrderSchedule,
  } = useStore();

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

        console.log("BUS DATA:", data);

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
    const pickupTime = calculatePickupTime(time);
    const orderDeadlineTime = calculateOrderDeadlineTime(pickupTime);

    setSelectedTransport({
      type: transportType,
      id,
      time,
      destination: dest,
      deadlineTime: calculateDeadline(time),
    });

    setOrderSchedule({
      departureTime: time,
      pickupTime,
      orderDeadlineTime,
    });
  };

  const handleNext = () => {
    if (!selectedTransport || !orderSchedule) return;
    navigate("/home");
  };

  const isSelected = (id: string) => {
    return (
      selectedTransport?.type === transportType && selectedTransport.id === id
    );
  };

  return (
    <>
      <NavBar title="귀가편 선택" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">
          귀가 교통편 선택
        </h2>

        <p className="mb-1.5 text-[13px] text-gray-400">
          출발 시간을 기준으로 수령 시간과 주문 마감 시간을 계산합니다.
        </p>

        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          기차 출발 20분 전 수령 추천
        </span>

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

        <p className="mb-2 text-xs font-semibold text-gray-500">
          {transportType === "train"
            ? "영주역 출발 열차"
            : "영주시외버스터미널 출발"}
        </p>

        <div className="flex flex-col gap-2">
          {transportType === "train" &&
            yeongjuTrains.map((t) => {
              const pickupTime = calculatePickupTime(t.time);
              const orderDeadlineTime = calculateOrderDeadlineTime(pickupTime);

              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id, t.time, t.destination)}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-3 ${
                    isSelected(t.id)
                      ? "border-primary bg-red-50"
                      : "hover:border-primary border-gray-200 bg-white hover:bg-red-50"
                  }`}
                >
                  <div className="text-left">
                    <p className="text-lg font-extrabold">{t.time}</p>
                    <p className="text-[11px] text-gray-400">
                      {t.type} · {t.duration}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[13px] text-gray-500">{t.destination}</p>
                    <p className="text-primary mt-1 text-[10px] font-semibold">
                      수령 추천 {pickupTime}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-amber-600">
                      주문 마감 {orderDeadlineTime}
                    </p>
                  </div>
                </button>
              );
            })}

          {transportType === "train" && yeongjuTrains.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">
              열차 데이터 없음
            </p>
          )}

          {transportType === "bus" && isBusLoading && (
            <p className="py-6 text-center text-sm text-gray-400">
              버스 정보 불러오는 중...
            </p>
          )}

          {transportType === "bus" && busErrorMessage && (
            <p className="py-6 text-center text-sm text-red-500">
              {busErrorMessage}
            </p>
          )}

          {transportType === "bus" &&
            !isBusLoading &&
            !busErrorMessage &&
            buses.map((b) => {
              const pickupTime = calculatePickupTime(b.time);
              const orderDeadlineTime = calculateOrderDeadlineTime(pickupTime);

              return (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b.id, b.time, b.destination)}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-3 ${
                    isSelected(b.id)
                      ? "border-primary bg-red-50"
                      : "hover:border-primary border-gray-200 bg-white hover:bg-red-50"
                  }`}
                >
                  <div className="text-left">
                    <p className="text-lg font-extrabold">{b.time}</p>
                    <p className="text-[11px] text-gray-400">
                      {b.company} · {b.duration}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[13px] text-gray-500">{b.destination}</p>
                    <p className="text-primary mt-1 text-[10px] font-semibold">
                      수령 추천 {pickupTime}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-amber-600">
                      주문 마감 {orderDeadlineTime}
                    </p>
                  </div>
                </button>
              );
            })}

          {transportType === "bus" &&
            !isBusLoading &&
            !busErrorMessage &&
            buses.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                버스 데이터 없음
              </p>
            )}
        </div>

        {selectedTransport && orderSchedule && (
          <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-800">
              선택한 귀가편
            </p>

            <p className="mt-1 text-[12px] text-amber-800">
              {selectedTransport.destination}행 · {orderSchedule.departureTime}{" "}
              출발
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg bg-white/70 p-2">
                <p className="text-gray-500">추천 수령 시간</p>
                <p className="text-dark mt-0.5 font-bold">
                  {orderSchedule.pickupTime}
                </p>
              </div>

              <div className="rounded-lg bg-white/70 p-2">
                <p className="text-gray-500">기본 주문 마감</p>
                <p className="text-dark mt-0.5 font-bold">
                  {orderSchedule.orderDeadlineTime}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          disabled={!selectedTransport || !orderSchedule}
          onClick={handleNext}
          className={`mt-5 w-full rounded-xl py-3.5 text-sm font-bold ${
            selectedTransport && orderSchedule
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          다음
        </button>
      </div>
    </>
  );
}
