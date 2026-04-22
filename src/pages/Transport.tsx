import { useNavigate } from "react-router";
import { useStore, calculateDeadline } from "../store/useStore";
import { mockTrains, mockBuses } from "../data/trains";
import NavBar from "../components/NavBar";

export default function Transport() {
  const navigate = useNavigate();
  const { transportType, setTransportType, setSelectedTransport } = useStore();

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
          열차 운행정보 API + 시외버스 운행 API
        </span>

        <div className="mt-5 mb-5 flex gap-2.5">
          <button
            onClick={() => setTransportType("train")}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
              transportType === "train"
                ? "bg-dark text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            🚂 열차
          </button>
          <button
            onClick={() => setTransportType("bus")}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-colors ${
              transportType === "bus"
                ? "bg-dark text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            🚌 시외버스
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500">
            출발일
          </label>
          <input
            readOnly
            value="2026년 4월 22일 (수)"
            className="text-dark mb-4 w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm"
          />
        </div>

        <p className="mb-2 text-xs font-semibold text-gray-500">
          {transportType === "train"
            ? "영주역 출발 열차"
            : "영주시외버스터미널 출발"}
        </p>

        <div className="flex flex-col gap-2">
          {transportType === "train"
            ? mockTrains.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id, t.time, t.destination)}
                  className="hover:border-primary flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-3 transition-colors hover:bg-red-50"
                >
                  <div className="text-left">
                    <p className="text-dark text-lg font-extrabold">{t.time}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {t.type} · {t.duration}
                    </p>
                  </div>
                  <p className="text-[13px] font-medium text-gray-500">
                    {t.destination}
                  </p>
                </button>
              ))
            : mockBuses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelect(b.id, b.time, b.destination)}
                  className="hover:border-primary flex items-center justify-between rounded-xl border border-gray-200 px-3.5 py-3 transition-colors hover:bg-red-50"
                >
                  <div className="text-left">
                    <p className="text-dark text-lg font-extrabold">{b.time}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {b.company} · {b.duration}
                    </p>
                  </div>
                  <p className="text-[13px] font-medium text-gray-500">
                    {b.destination}
                  </p>
                </button>
              ))}
        </div>
      </div>
    </>
  );
}
