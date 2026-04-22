import { useNavigate } from "react-router";

const items = [
  { path: "/home", icon: "🏠", label: "홈" },
  { path: "/category", icon: "🔍", label: "탐색" },
  { path: "/cart", icon: "🛒", label: "장바구니" },
  { path: "/tracking", icon: "📋", label: "주문" },
  { path: "/home", icon: "👤", label: "마이" },
];

interface Props {
  active?: string;
}

export default function BottomNav({ active = "/home" }: Props) {
  const navigate = useNavigate();

  return (
    <div className="sticky bottom-0 mt-5 flex justify-around border-t border-gray-100 bg-white py-2.5">
      {items.map((item, i) => (
        <button
          key={`${item.path}-${i}`}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center gap-0.5"
        >
          <span className="text-lg">{item.icon}</span>
          <span
            className={`text-[10px] ${
              active === item.path ? "text-primary font-bold" : "text-gray-400"
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
