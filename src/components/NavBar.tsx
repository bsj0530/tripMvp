import { useNavigate } from "react-router";

interface NavBarProps {
  title: string;
  fallbackPath?: string;
}

export default function NavBar({ title, fallbackPath = "/home" }: NavBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath, { replace: true });
  };

  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3.5">
      <button onClick={handleBack} className="p-0.5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span className="text-dark text-[15px] font-bold">{title}</span>
    </div>
  );
}
