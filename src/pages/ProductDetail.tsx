import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../store/useStore";
import { getProductById } from "../data/products";
import { mockShops } from "../data/shops";
import NavBar from "../components/NavBar";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { selectedProductId, addToCart } = useStore();
  const [qty, setQty] = useState(1);

  const product = getProductById(selectedProductId || "");
  const shop = mockShops.find((s) => s.id === product?.shopId);

  if (!product) return null;

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

        <div className="px-5 pt-4 pb-5">
          <p className="text-primary text-[11px] font-semibold">
            {shop?.isOpen ? "영업 중" : "영업 종료"} · 영주역{" "}
            {shop?.distanceFromStation}km
          </p>

          <h2 className="text-dark mt-1 text-xl font-extrabold">
            {product.name}
          </h2>

          <p className="mb-3 text-[13px] text-gray-400">{product.shopName}</p>

          <p className="text-dark mb-4 text-[22px] font-extrabold">
            {formatPrice(product.price)}원
          </p>

          <div className="mb-4 rounded-[10px] border border-gray-200 bg-gray-50 p-3">
            <p className="mb-1.5 text-xs font-semibold text-gray-500">
              상품 소개
            </p>
            <p className="text-xs leading-relaxed text-gray-400">
              {product.description}
            </p>
          </div>

          {product.isPickupOnly && (
            <div className="mb-4 rounded-[10px] border border-amber-400/20 bg-amber-50 p-3">
              <p className="text-xs font-semibold text-amber-800">
                당일 픽업 전용 상품
              </p>
              <p className="mt-0.5 text-[11px] text-amber-800">
                이 상품은 택배로 구매할 수 없어요. 여행, 담다에서만 만날 수
                있습니다.
              </p>
            </div>
          )}

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
