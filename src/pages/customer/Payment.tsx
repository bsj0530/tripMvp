import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../../store/useStore";
import NavBar from "../../components/NavBar";

export default function Payment() {
  const navigate = useNavigate();

  const {
    cart,
    getCartTotal,
    getServiceFee,
    getOrderEstimate,
    orderSchedule,
    selectedTransport,
    clearCart,
    setOrderId,
  } = useStore();

  const estimate = getOrderEstimate();

  const cartTotal = getCartTotal();
  const serviceFee = getServiceFee();
  const finalTotal = cartTotal + serviceFee;

  const handlePayment = () => {
    console.log("결제 클릭", {
      canOrder: estimate.canOrder,
      cartLength: cart.length,
    });

    if (!estimate.canOrder || cart.length === 0) return;

    const orderId = `order-${Date.now()}`;

    const orderData = {
      id: orderId,
      items: cart,
      cartTotal,
      serviceFee,
      finalTotal,
      estimate,
      orderSchedule,
      selectedTransport,
      createdAt: new Date().toISOString(),
      pickupLocation: "영주역 수령 장소",
    };

    setOrderId(orderId);
    localStorage.setItem("current-order", JSON.stringify(orderData));
    clearCart();
    navigate("/tracking");
  };

  return (
    <>
      <NavBar title="결제" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">
          주문 확인 및 결제
        </h2>

        {selectedTransport && orderSchedule && (
          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800">수령 일정</p>

            <p className="mt-1 text-sm font-bold text-amber-900">
              {selectedTransport.destination}행 · {orderSchedule.departureTime}{" "}
              출발
            </p>

            <div className="mt-2 text-[12px] text-amber-800">
              <p>추천 수령: {orderSchedule.pickupTime}</p>
              <p>주문 마감: {orderSchedule.orderDeadlineTime}</p>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3"
            >
              <div>
                <p className="text-dark text-sm font-bold">
                  {item.product.name}
                </p>

                <p className="text-[11px] text-gray-400">
                  {item.product.shopName} · {item.quantity}개
                </p>
              </div>

              <p className="text-dark text-sm font-extrabold">
                {formatPrice(item.product.price * item.quantity)}원
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-5 rounded-2xl p-4 ${
            estimate.canOrder ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <p
            className={`text-sm font-extrabold ${
              estimate.canOrder ? "text-green-700" : "text-red-600"
            }`}
          >
            {estimate.message}
          </p>

          <p className="mt-1 text-[12px] text-gray-500">
            총 필요 시간 {estimate.totalNeedMinutes}분
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">상품 금액</span>
            <span className="text-dark font-bold">
              {formatPrice(cartTotal)}원
            </span>
          </div>

          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-400">수령 대행비</span>
            <span className="text-dark font-bold">
              {formatPrice(serviceFee)}원
            </span>
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <div className="flex justify-between">
              <span className="text-dark text-sm font-bold">총 결제 금액</span>
              <span className="text-primary text-lg font-extrabold">
                {formatPrice(finalTotal)}원
              </span>
            </div>
          </div>
        </div>

        <button
          disabled={!estimate.canOrder || cart.length === 0}
          onClick={handlePayment}
          className={`mt-5 w-full rounded-xl py-3.5 text-sm font-bold ${
            estimate.canOrder && cart.length > 0
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {estimate.canOrder ? "결제하기" : "주문 불가"}
        </button>

        {!estimate.canOrder && (
          <button
            onClick={() => navigate("/cart")}
            className="mt-2 w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-500"
          >
            장바구니 수정하기
          </button>
        )}
      </div>
    </>
  );
}
