import { useNavigate } from "react-router";
import { useStore, formatPrice } from "../store/useStore";
import { getProductsByCategory } from "../data/products";
import { mockCategories } from "../data/categories";
import NavBar from "../components/NavBar";

export default function Category() {
  const navigate = useNavigate();
  const { selectedCategoryId, setSelectedProductId } = useStore();

  const category = mockCategories.find((c) => c.id === selectedCategoryId);
  const products = getProductsByCategory(selectedCategoryId);

  const handleProduct = (id: string) => {
    setSelectedProductId(id);
    navigate("/product");
  };

  return (
    <>
      <NavBar title={category?.name || "전체보기"} />
      <div className="px-5 pt-4">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          상가업소 정보 → 영업여부 실시간 필터
        </span>

        <div className="mt-3 mb-4 flex gap-2 overflow-x-auto">
          {["전체", "영업 중", "거리순", "평점순", "인기순"].map((f, i) => (
            <span
              key={f}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap ${
                i === 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {f}
            </span>
          ))}
        </div>

        <div className="flex flex-col">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => handleProduct(p.id)}
              className="flex gap-3 border-b border-gray-100 py-3 text-left"
            >
              <div className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-[28px]">
                {p.image}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-dark truncate text-sm font-semibold">
                  {p.name}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">{p.shopName}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-dark text-sm font-extrabold">
                    {formatPrice(p.price)}원
                  </span>
                  <span className="text-[11px] text-amber-500">
                    ★ {p.rating}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
