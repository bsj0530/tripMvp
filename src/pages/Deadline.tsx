import { useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import NavBar from "../components/NavBar";

export default function Deadline() {
  const navigate = useNavigate();
  const { selectedTransport } = useStore();

  const t = selectedTransport;

  return (
    <>
      <NavBar title="마감시간 확인" />
      <div className="px-5 py-5">
        <h2 className="text-dark mb-1 text-[22px] font-extrabold">
          픽업 마감시간
        </h2>

        <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          출발시간에서 자동 역산
        </span>

        <div className="from-dark via-darkblue to-deepblue mt-5 rounded-2xl bg-gradient-to-br p-5 text-center">
          <p className="text-xs text-white/50">선택하신 교통편</p>

          <p className="mt-1.5 text-lg font-bold text-white">
            {t?.time} {t?.type === "train" ? "무궁화호" : "시외버스"} →{" "}
            {t?.destination}
          </p>

          <div className="my-3.5 h-px w-full bg-white/20" />

          <p className="text-xs text-white/50">주문 마감시간</p>
          <p className="text-primary mt-1 text-4xl font-black">
            {t?.deadlineTime}
          </p>

          <p className="mt-1 text-xs text-white/40">
            출발 1시간 전까지 주문 가능
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-50 p-3.5">
          <p className="text-xs leading-relaxed text-amber-800">
            이 시간 이후 주문은 다음 교통편 기준으로 처리됩니다. 교통편은 언제든
            변경할 수 있어요.
          </p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="bg-primary mt-6 w-full rounded-xl py-3.5 text-[15px] font-bold text-white"
        >
          확인하고 쇼핑 시작
        </button>
      </div>
    </>
  );
}
