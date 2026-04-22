import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../store/useStore";
import NavBar from "../components/NavBar";

const METHODS = ["카카오페이", "네이버페이", "신용/체크카드", "토스페이"];

export default function Payment() {
  const navigate = useNavigate();
  const { cart, getCartTotal, getServiceFee, setOrderId, clearCart } =
    useStore();
  const [selected, setSelected] = useState(0);

  const total = getCartTotal() + getServiceFee();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const firstItem = cart[0]?.product.name || "";

  const handlePay = () => {
    const orderId = `YJ-20260422-${String(
      Math.floor(Math.random() * 9999),
    ).padStart(4, "0")}`;

    setOrderId(orderId);
    clearCart();
    navigate("/tracking");
  };

  return (
    <>
      <NavBar title="결제" />
      <div className="px-5 pt-4 pb-5">
        <p className="text-dark mb-3 text-sm font-bold">결제 수단 선택</p>

        <div className="flex flex-col gap-2">
          {METHODS.map((m, i) => (
            <button
              key={m}
              onClick={() => setSelected(i)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors ${
                selected === i
                  ? "border-primary bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <span className="text-dark text-sm font-medium">{m}</span>

              {selected === i && (
                <span className="bg-primary flex h-[18px] w-[18px] items-center justify-center rounded-full">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-3.5">
          <p className="text-dark mb-2 text-[13px] font-semibold">주문 요약</p>

          <div className="text-xs leading-[1.8] text-gray-400">
            {firstItem} {itemCount > 1 ? `외 ${itemCount - 1}건` : ""}
            <br />
            픽업: 영주역 1층 픽업존
            <br />
            마감: 14:35까지
          </div>

          <div className="my-2.5 h-px bg-gray-200" />

          <div className="text-dark flex justify-between text-base font-extrabold">
            <span>결제 금액</span>
            <span>{formatPrice(total)}원</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          className="bg-primary mt-6 w-full rounded-xl py-3.5 text-[15px] font-bold text-white"
        >
          결제 완료
        </button>
      </div>
    </>
  );
}
