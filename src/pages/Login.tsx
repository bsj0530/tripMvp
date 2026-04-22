import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";

export default function Login() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar title="로그인" />
      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">로그인</h2>
        <p className="mb-7 text-[13px] text-gray-400">다시 오셨군요!</p>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              휴대폰 번호
            </label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              readOnly
              className="text-dark w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              readOnly
              className="text-dark w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/transport")}
          className="bg-primary mt-6 w-full rounded-xl py-3.5 text-[15px] font-bold text-white"
        >
          로그인
        </button>

        <div className="mt-4 flex justify-center gap-5 text-xs text-gray-400">
          <span className="cursor-pointer">비밀번호 찾기</span>
          <span>|</span>
          <span onClick={() => navigate("/signup")} className="cursor-pointer">
            회원가입
          </span>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-3.5 text-[11px] text-gray-300">간편 로그인</p>
          <div className="flex justify-center gap-4">
            {[
              { bg: "bg-[#03C75A]", label: "N", color: "text-white" },
              { bg: "bg-[#FEE500]", label: "K", color: "text-black" },
              { bg: "bg-black", label: "A", color: "text-white" },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => navigate("/transport")}
                className={`h-12 w-12 rounded-full ${s.bg} ${s.color} text-lg font-extrabold`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
