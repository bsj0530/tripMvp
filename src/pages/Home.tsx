import { useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import { mockCategories } from "../data/categories";
import NavBar from "../components/NavBar";

export default function Home() {
  const navigate = useNavigate();

  const {
    selectedTransport,
    orderSchedule,
    selectedCategoryId,
    setSelectedCategoryId,
  } = useStore();

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    navigate("/category");
  };

  return (
    <>
      <NavBar title="여행, 담다" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">
          영주에서 챙겨갈 특산품
        </h2>

        <p className="mt-1 text-[13px] text-gray-400">
          귀가 시간에 맞춰 영주역에서 받을 수 있어요.
        </p>

        {selectedTransport && orderSchedule && (
          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800">내 귀가 일정</p>

            <p className="mt-1 text-sm font-bold text-amber-900">
              {selectedTransport.destination}행 · {orderSchedule.departureTime}{" "}
              출발
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[11px] text-gray-500">추천 수령 시간</p>
                <p className="text-dark mt-1 text-sm font-extrabold">
                  {orderSchedule.pickupTime}
                </p>
              </div>

              <div className="rounded-xl bg-white/70 p-3">
                <p className="text-[11px] text-gray-500">기본 주문 마감</p>
                <p className="text-dark mt-1 text-sm font-extrabold">
                  {orderSchedule.orderDeadlineTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {!selectedTransport && (
          <button
            onClick={() => navigate("/transport")}
            className="mt-4 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left"
          >
            <p className="text-dark text-sm font-bold">
              귀가편을 먼저 선택해주세요
            </p>
            <p className="mt-1 text-[12px] text-gray-400">
              출발 시간에 맞춰 수령 시간을 계산할 수 있어요.
            </p>
          </button>
        )}

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-dark text-base font-extrabold">카테고리</h3>
            <p className="text-[11px] text-gray-400">
              원하는 상품군을 골라주세요
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`rounded-2xl border p-4 text-left ${
                  selectedCategoryId === category.id
                    ? "border-primary bg-red-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="text-[32px]">{category.icon}</div>

                <p className="text-dark mt-2 text-sm font-bold">
                  {category.name}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">주변 매장 보기</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-dark text-sm font-bold">
            주문 가능 여부는 장바구니에서 자동 계산돼요
          </p>

          <p className="mt-1 text-[12px] leading-relaxed text-gray-400">
            방문 매장 수, 픽업 시간, 배달 시간, 수령 마감 시간을 기준으로 결제
            가능 여부를 판단합니다.
          </p>
        </div>
      </div>
    </>
  );
}
