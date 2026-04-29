import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../../store/useStore";
import NavBar from "../../components/NavBar";
import { getRealOrderResultAdvanced } from "../../lib/timeCalcAdvanced";
import { getAIExplain } from "../../api/ai";

const YEONGJU_STATION = {
  lat: 36.8106,
  lng: 128.6241,
};

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getServiceFee,
    orderSchedule,
  } = useStore();

  const [result, setResult] = useState<any>(null);
  const [ai, setAi] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const cartTotal = getCartTotal();
  const serviceFee = getServiceFee();
  const finalTotal = cartTotal + serviceFee;

  useEffect(() => {
    if (!orderSchedule || cart.length === 0) return;

    const run = async () => {
      setLoading(true);

      try {
        // 🔥 실제 동선 기반 계산
        const real = await getRealOrderResultAdvanced({
          cart,
          pickupTime: orderSchedule.pickupTime,
          station: YEONGJU_STATION,
        });

        setResult(real);

        // 🤖 AI 설명
        const aiRes = await getAIExplain({
          canOrder: real.canOrder,
          moveMinutes: real.moveMinutes,
          totalNeed: real.totalNeed,
          deadline: real.deadline,
          cart,
        });

        setAi(aiRes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [cart, orderSchedule]);

  const handlePayment = () => {
    if (!result?.canOrder) return;
    navigate("/payment");
  };

  return (
    <>
      <NavBar title="장바구니" />

      <div className="px-5 py-5">
        {cart.length === 0 ? (
          <p className="text-center text-gray-400">장바구니가 비어있어요</p>
        ) : (
          <>
            {/* 상품 리스트 */}
            {cart.map((item) => (
              <div key={item.product.id} className="mb-3 border-b pb-3">
                <p className="font-bold">{item.product.name}</p>
                <p className="text-sm text-gray-400">{item.product.shopName}</p>

                <div className="mt-2 flex justify-between">
                  <div>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span className="mx-2">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-red-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}

            {/* 🔥 계산 결과 */}
            {loading && (
              <p className="mt-4 text-sm text-gray-400">동선 계산 중...</p>
            )}

            {result && !loading && (
              <div className="mt-5 rounded-2xl border bg-gray-50 p-4">
                <p className="text-sm font-bold">자동 시간 계산</p>

                <p className="mt-2 text-xs">
                  현재: {new Date().toLocaleTimeString()}
                </p>

                <p className="text-xs">
                  마감: {result.deadline.toLocaleTimeString()}
                </p>

                <p className="text-xs">
                  이동 시간: {result.moveMinutes.toFixed(1)}분
                </p>

                <p className="text-xs">
                  총 필요 시간: {result.totalNeed.toFixed(1)}분
                </p>

                <p className="text-xs">방문 매장: {cart.length}곳</p>

                <p
                  className={`mt-3 font-bold ${
                    result.canOrder ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {result.canOrder ? "시간 내 수령 가능" : "시간 내 수령 불가"}
                </p>
              </div>
            )}

            {/* 🤖 AI */}
            {ai && (
              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="font-bold">AI 분석</p>

                <p className="mt-2 text-sm">{ai.message}</p>
                <p className="text-xs text-gray-400">{ai.summary}</p>
              </div>
            )}

            {/* 결제 */}
            <div className="mt-5">
              <p className="font-bold">총 금액: {formatPrice(finalTotal)}원</p>

              <button
                disabled={!result?.canOrder}
                onClick={handlePayment}
                className={`mt-3 w-full rounded py-3 ${
                  result?.canOrder
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                결제하기
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
