import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../../store/useStore";
import { getProductById } from "../../data/products";
import NavBar from "../../components/NavBar";

export default function ProductDetail() {
  const navigate = useNavigate();

  const { selectedProductId, selectedShop, orderSchedule, addToCart } =
    useStore();

  const [qty, setQty] = useState(1);

  const product = getProductById(selectedProductId || "");

  if (!product) {
    return (
      <>
        <NavBar title="상품 상세" />

        <div className="px-5 py-16 text-center">
          <p className="text-dark text-lg font-extrabold">
            상품 정보를 찾을 수 없어요
          </p>

          <p className="mt-2 text-sm text-gray-400">
            매장을 다시 선택해주세요.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="bg-primary mt-6 rounded-xl px-5 py-3 text-sm font-bold text-white"
          >
            홈으로 가기
          </button>
        </div>
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate("/cart");
  };

  return (
    <>
      <NavBar title="상품 상세" />

      <div>
        <div className="flex h-[200px] items-center justify-center bg-gray-100 text-[64px]">
          {product.image}
        </div>

        <div className="px-5 pt-4 pb-6">
          <p className="text-primary text-[11px] font-semibold">
            {(selectedShop?.isOpen ?? true) ? "영업 중" : "영업 종료"}
            {selectedShop?.distanceFromStation !== undefined
              ? ` · 영주역 ${selectedShop.distanceFromStation.toFixed(1)}km`
              : " · 영주역 수령 가능"}
          </p>

          <h2 className="text-dark mt-1 text-xl font-extrabold">
            {product.name}
          </h2>

          <p className="mb-3 text-[13px] text-gray-400">{product.shopName}</p>

          <p className="text-dark mb-4 text-[22px] font-extrabold">
            {formatPrice(product.price)}원
          </p>

          {orderSchedule && (
            <div className="mb-4 rounded-[10px] border border-amber-400/20 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">
                수령 예정 정보
              </p>

              <p className="mt-1 text-[11px] text-amber-800">
                출발 {orderSchedule.departureTime} · 추천 수령{" "}
                {orderSchedule.pickupTime}
              </p>

              <p className="mt-0.5 text-[11px] font-bold text-amber-900">
                기본 주문 마감 {orderSchedule.orderDeadlineTime}
              </p>
            </div>
          )}

          <div className="mb-4 rounded-[10px] border border-gray-200 bg-gray-50 p-3">
            <p className="mb-1.5 text-xs font-semibold text-gray-500">
              상품 소개
            </p>

            <p className="text-xs leading-relaxed text-gray-400">
              {product.description}
            </p>
          </div>

          <div className="mb-4 rounded-[10px] border border-gray-200 bg-white p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">평점</span>
              <span className="text-dark font-bold">
                ⭐ {product.rating.toFixed(1)}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400">상품 유형</span>
              <span className="text-dark font-bold">{product.category}</span>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-center gap-5">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-9 w-9 rounded-full border border-gray-300 bg-white text-lg"
            >
              -
            </button>

            <span className="min-w-[20px] text-center text-lg font-bold">
              {qty}
            </span>

            <button
              onClick={() => setQty(qty + 1)}
              className="h-9 w-9 rounded-full border border-gray-300 bg-white text-lg"
            >
              +
            </button>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleAddToCart}
              className="border-primary text-primary flex-1 rounded-xl border py-3.5 text-sm font-bold"
            >
              장바구니
            </button>

            <button
              onClick={handleAddToCart}
              className="bg-primary flex-[2] rounded-xl py-3.5 text-sm font-bold text-white"
            >
              바로 주문
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
