import { useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import NavBar from "../components/NavBar";

export default function Pickup() {
  const navigate = useNavigate();
  const { orderId } = useStore();

  const displayId = orderId || "YJ-20260422-0047";

  const qrPattern = [
    1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0,
    1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
  ];

  return (
    <>
      <NavBar title="픽업" />
      <div className="px-5 py-5 text-center">
        <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-[13px] font-semibold text-green-800">
          픽업 가능
        </span>

        <h2 className="text-dark mb-1 text-xl font-extrabold">
          픽업존에서 스캔하세요
        </h2>

        <p className="mb-6 text-[13px] text-gray-400">영주역 1층 픽업존</p>

        {/* QR */}
        <div className="mx-auto flex h-[180px] w-[180px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-7 gap-[3px]">
            {qrPattern.map((v, i) => (
              <div
                key={i}
                className={`h-[14px] w-[14px] rounded-sm ${
                  v ? "bg-dark" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-dark mt-3 text-sm font-bold">{displayId}</p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-left">
          <p className="text-dark mb-2 text-[13px] font-semibold">주문 내역</p>
          <div className="text-xs leading-[1.8] text-gray-400">
            영주한우빵 (6개입) × 1
            <br />
            홍삼절편 소포장 × 1
            <br />
            인삼차 10포 × 2
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="text-primary mt-5 text-[13px] font-semibold"
        >
          수령 완료
        </button>
      </div>
    </>
  );
}
