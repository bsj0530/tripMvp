import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../store/useStore";
import { getProductsByShop } from "../data/products";
import NavBar from "../components/NavBar";

export default function Products() {
  const navigate = useNavigate();

  const { selectedShop, selectedCategoryId, setSelectedProductId } = useStore();

  const products = useMemo(() => {
    return getProductsByShop(selectedShop, selectedCategoryId);
  }, [selectedShop, selectedCategoryId]);

  const handleProductClick = (product: (typeof products)[number]) => {
    localStorage.setItem("selected-product", JSON.stringify(product));
    setSelectedProductId(product.id);
    navigate("/product");
  };

  return (
    <>
      <NavBar title={selectedShop?.name || "상품 목록"} />

      <div className="px-5 pt-4 pb-6">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-dark text-sm font-extrabold">
            {selectedShop?.name || "영주 특산물 매장"}
          </p>

          <p className="mt-1 text-[12px] text-gray-400">
            이 매장에서 주문 가능한 대표 상품입니다.
          </p>

          {selectedShop?.distanceFromStation !== undefined && (
            <p className="text-primary mt-2 text-[11px] font-semibold">
              영주역에서 {selectedShop.distanceFromStation.toFixed(1)}km
            </p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm"
            >
              <div className="flex h-[110px] items-center justify-center bg-gray-100 text-[48px]">
                {product.image}
              </div>

              <div className="p-3">
                <p className="text-dark line-clamp-1 text-sm font-bold">
                  {product.name}
                </p>

                <p className="mt-1 line-clamp-1 text-[11px] text-gray-400">
                  {product.shopName}
                </p>

                <p className="text-dark mt-2 text-sm font-extrabold">
                  {formatPrice(product.price)}원
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  ⭐ {product.rating.toFixed(1)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
