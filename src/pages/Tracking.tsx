import { useNavigate } from "react-router";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="from-dark via-darkblue to-deepblue flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-br px-6">
      <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M20 9v11a2 2 0 01-2 2H6a2 2 0 01-2-2V9" />
          <path d="M9 22V12h6v10" />
          <path d="M2 10.6L12 2l10 8.6" />
        </svg>
      </div>

      <h1 className="text-[26px] font-extrabold tracking-tight text-white">
        여행, 담다
      </h1>

      <p className="text-center text-xs leading-relaxed text-white/60">
        관광 중 주문하고
        <br />
        떠나는 날 역에서 담아가세요
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-2.5">
        <button
          onClick={() => navigate("/home")}
          className="bg-primary rounded-xl py-3.5 text-[15px] font-bold text-white"
        >
          시작하기
        </button>

        <button
          onClick={() => navigate("/login")}
          className="rounded-xl border border-white/20 py-3.5 text-sm font-medium text-white/80"
        >
          이미 계정이 있어요
        </button>
      </div>
    </div>
  );
}
