import { useState } from "react";
import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";

type Role = "tourist" | "rider" | "seller";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>("tourist");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    authCode: "",
    password: "",
    confirmPassword: "",
    agreeService: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const isActive =
    role ||
    form.name.trim() ||
    form.phone.trim() ||
    form.authCode.trim() ||
    form.password.trim() ||
    form.confirmPassword.trim() ||
    form.agreeService ||
    form.agreePrivacy ||
    form.agreeMarketing;

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignup = () => {
    if (!isActive) return;

    if (!form.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!form.phone.trim()) {
      alert("휴대폰 번호를 입력해주세요.");
      return;
    }

    if (form.password.length < 8) {
      alert("비밀번호는 8자 이상 입력해주세요.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.agreeService || !form.agreePrivacy) {
      alert("필수 약관에 동의해주세요.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        role,
        name: form.name,
        phone: form.phone,
        password: form.password,
        agreeMarketing: form.agreeMarketing,
        isLoggedIn: false,
      }),
    );

    alert("회원가입이 완료되었습니다.");
    navigate("/login");
  };

  return (
    <>
      <NavBar title="회원가입" />

      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">회원가입</h2>
        <p className="mb-7 text-[13px] text-gray-400">
          영주 특산물을 만나보세요
        </p>

        <div className="mb-5">
          <label className="mb-2 block text-xs font-semibold text-gray-500">
            가입 유형
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "tourist", label: "관광객" },
              { value: "rider", label: "배달원" },
              { value: "seller", label: "판매점" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRole(item.value as Role)}
                className={`rounded-xl border py-3 text-sm font-bold ${
                  role === item.value
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <InputField
            label="이름"
            placeholder="홍길동"
            value={form.name}
            onChange={(value) => handleChange("name", value)}
          />

          <InputField
            label="휴대폰 번호"
            placeholder="010-1234-5678"
            type="tel"
            value={form.phone}
            onChange={(value) => handleChange("phone", value)}
          />

          <div className="flex gap-2">
            <div className="flex-1">
              <InputField
                label="인증번호"
                placeholder="6자리 입력"
                value={form.authCode}
                onChange={(value) => handleChange("authCode", value)}
              />
            </div>

            <button
              type="button"
              onClick={() => alert("인증번호가 발송되었습니다.")}
              className="border-primary text-primary self-end rounded-[10px] border px-3.5 py-3 text-xs font-semibold whitespace-nowrap"
            >
              인증 요청
            </button>
          </div>

          <InputField
            label="비밀번호"
            placeholder="8자 이상"
            type="password"
            value={form.password}
            onChange={(value) => handleChange("password", value)}
          />

          <InputField
            label="비밀번호 확인"
            placeholder="다시 입력"
            type="password"
            value={form.confirmPassword}
            onChange={(value) => handleChange("confirmPassword", value)}
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <CheckField
            text="[필수] 서비스 이용약관 동의"
            checked={form.agreeService}
            onChange={(checked) => handleChange("agreeService", checked)}
          />

          <CheckField
            text="[필수] 개인정보 수집·이용 동의"
            checked={form.agreePrivacy}
            onChange={(checked) => handleChange("agreePrivacy", checked)}
          />

          <CheckField
            text="[선택] 마케팅 정보 수신 동의"
            checked={form.agreeMarketing}
            onChange={(checked) => handleChange("agreeMarketing", checked)}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={!isActive}
          className={`mt-6 w-full rounded-xl py-3.5 text-[15px] font-bold text-white ${
            isActive ? "bg-primary" : "cursor-not-allowed bg-gray-300"
          }`}
        >
          가입 완료
        </button>
      </div>
    </>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-500">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-dark w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm"
      />
    </div>
  );
}

function CheckField({
  text,
  checked,
  onChange,
}: {
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-primary"
      />
      {text}
    </label>
  );
}
