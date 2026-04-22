import { useNavigate } from "react-router";
import { useStore } from "../store/useStore";
import { mockShops } from "../data/shops";
import { mockCategories } from "../data/categories";
import BottomNav from "../components/BottomNav";

export default function Home() {
  const navigate = useNavigate();
  const { selectedTransport, setSelectedCategoryId } = useStore();

  const handleCategory = (id: string) => {
    setSelectedCategoryId(id);
    navigate("/category");
  };

  const nearbyShops = mockShops
    .filter((s) => s.distanceFromStation < 5)
    .slice(0, 3);

  return (
    <div className="px-5 pt-4 pb-0">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-gray-400">
            영주역 · {selectedTransport?.time || "15:35"} 출발
          </p>
          <p className="text-primary text-[11px] font-semibold">
            마감까지 2시간 31분
          </p>
        </div>
        <button
          onClick={() => navigate("/transport")}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-500"
        >
          변경
        </button>
      </div>

      <button
        onClick={() => {
          setSelectedCategoryId("all");
          navigate("/category");
        }}
        className="mb-5 flex w-full items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#999"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span className="text-[13px] text-gray-400">영주 특산물 검색</span>
      </button>

      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-600">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
        TourAPI 관광지 위치 기반 추천
      </span>

      <h3 className="text-dark mt-3 mb-2.5 text-sm font-bold">
        부석사 근처 추천 가게
      </h3>
      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2">
        {nearbyShops.map((shop) => (
          <button
            key={shop.id}
            onClick={() => {
              setSelectedCategoryId(shop.categoryId);
              navigate("/category");
            }}
            className="min-w-[130px] flex-shrink-0 rounded-[14px] border border-gray-200 bg-gray-50 p-2.5 text-left"
          >
            <div className="mb-2 flex h-[70px] items-center justify-center rounded-[10px] bg-gray-200 text-3xl">
              {shop.image}
            </div>
            <p className="text-dark text-[13px] font-bold">{shop.name}</p>
            <p className="text-[11px] text-gray-400">{shop.category}</p>
          </button>
        ))}
      </div>

      <h3 className="text-dark mt-5 mb-2.5 text-sm font-bold">카테고리</h3>
      <div className="grid grid-cols-4 gap-2.5">
        {mockCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategory(cat.id)}
            className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 px-1 py-3 transition-colors hover:bg-gray-100"
          >
            <span className="text-[22px]">{cat.icon}</span>
            <span className="text-[11px] font-medium text-gray-500">
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      <BottomNav active="home" />
    </div>
  );
}
