import { useState } from "react";
import { useNavigate } from "react-router";
import NavBar from "../../components/NavBar";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const isActive = form.phone.trim() || form.password.trim();

  const handleLogin = () => {
    if (!isActive) return;

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("가입된 계정이 없습니다.");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      alert("회원 정보가 올바르지 않습니다. 다시 회원가입 해주세요.");
      localStorage.removeItem("user");
      navigate("/signup");
      return;
    }

    if (user.phone !== form.phone) {
      alert("휴대폰 번호가 일치하지 않습니다.");
      return;
    }

    if (user.password !== form.password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const loggedInUser = {
      ...user,
      isLoggedIn: true,
    };

    localStorage.setItem("user", JSON.stringify(loggedInUser));

    if (user.role === "seller") {
      navigate("/seller");
      return;
    }

    if (user.role === "rider") {
      navigate("/rider");
      return;
    }

    navigate("/transport");
  };

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
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
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
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="text-dark w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={!isActive}
          className={`mt-6 w-full rounded-xl py-3.5 text-[15px] font-bold text-white ${
            isActive ? "bg-primary" : "cursor-not-allowed bg-gray-300"
          }`}
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
      </div>
    </>
  );
}
