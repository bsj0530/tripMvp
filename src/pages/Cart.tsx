import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../store/useStore";
import NavBar from "../components/NavBar";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, getCartTotal, getServiceFee } = useStore();

  const groupedByShop = cart.reduce<Record<string, typeof cart>>(
    (acc, item) => {
      const key = item.product.shopName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {},
  );

  const total = getCartTotal();
  const fee = getServiceFee();

  return (
    <>
      <NavBar title="장바구니" />
      <div className="px-5 pt-4 pb-5">
        <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-purple-500/20 bg-purple-50 p-2.5">
          <span className="text-sm">⏰</span>
          <p className="text-xs text-purple-800">
            <b>14:35</b>까지 주문 가능 · 남은 시간 <b>2시간 31분</b>
          </p>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          상가업소 정보 → 여러 가게 묶음 주문
        </span>

        {cart.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-3 text-3xl text-gray-300">🛒</p>
            <p className="text-sm text-gray-400">장바구니가 비어있어요</p>
            <button
              onClick={() => navigate("/home")}
              className="bg-primary mt-4 rounded-lg px-6 py-2 text-sm font-semibold text-white"
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <>
            {Object.entries(groupedByShop).map(([shopName, items]) => (
              <div key={shopName} className="mt-3">
                <p className="text-dark mb-2 text-[13px] font-semibold">
                  {shopName}
                </p>

                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between border-b border-gray-100 py-2.5"
                  >
                    <div>
                      <p className="text-dark text-[13px] font-medium">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {item.quantity}개 ·{" "}
                        {formatPrice(item.product.price * item.quantity)}원
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-6 w-6 rounded-md border border-gray-300 bg-white text-sm"
                      >
                        -
                      </button>

                      <span className="min-w-[16px] text-center text-[13px] font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="h-6 w-6 rounded-md border border-gray-300 bg-white text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={() => navigate("/home")}
              className="text-primary mt-3 w-full text-center text-[13px] font-semibold"
            >
              + 다른 가게 상품 추가
            </button>

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-3.5">
              <div className="mb-1.5 flex justify-between text-[13px] text-gray-400">
                <span>상품 금액</span>
                <span>{formatPrice(total)}원</span>
              </div>
              <div className="mb-1.5 flex justify-between text-[13px] text-gray-400">
                <span>픽업 서비스 수수료</span>
                <span>{formatPrice(fee)}원</span>
              </div>
              <div className="my-2.5 h-px bg-gray-200" />
              <div className="text-dark flex justify-between text-base font-extrabold">
                <span>총 결제금액</span>
                <span>{formatPrice(total + fee)}원</span>
              </div>
            </div>

            <p className="mt-2.5 text-[11px] text-gray-400">
              수령 장소: 영주역 픽업존 (1층 대합실 옆)
            </p>

            <button
              onClick={() => navigate("/payment")}
              className="bg-primary mt-4 w-full rounded-xl py-3.5 text-[15px] font-bold text-white"
            >
              {formatPrice(total + fee)}원 결제하기
            </button>
          </>
        )}
      </div>
    </>
  );
}
