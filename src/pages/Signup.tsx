import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar title="회원가입" />
      <div className="px-5 py-5">
        <h2 className="text-dark text-[22px] font-extrabold">회원가입</h2>
        <p className="mb-7 text-[13px] text-gray-400">
          영주 특산물을 만나보세요
        </p>

        <div className="flex flex-col gap-3.5">
          <InputField label="이름" placeholder="홍길동" />
          <InputField
            label="휴대폰 번호"
            placeholder="010-1234-5678"
            type="tel"
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <InputField label="인증번호" placeholder="6자리 입력" />
            </div>
            <button className="border-primary text-primary self-end rounded-[10px] border px-3.5 py-3 text-xs font-semibold whitespace-nowrap">
              인증 요청
            </button>
          </div>
          <InputField label="비밀번호" placeholder="8자 이상" type="password" />
          <InputField
            label="비밀번호 확인"
            placeholder="다시 입력"
            type="password"
          />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {[
            "[필수] 서비스 이용약관 동의",
            "[필수] 개인정보 수집·이용 동의",
            "[선택] 마케팅 정보 수신 동의",
          ].map((text) => (
            <label
              key={text}
              className="flex cursor-pointer items-center gap-2 text-xs text-gray-500"
            >
              <input type="checkbox" className="accent-primary" />
              {text}
            </label>
          ))}
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-primary mt-6 w-full rounded-xl py-3.5 text-[15px] font-bold text-white"
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
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-500">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        readOnly
        className="text-dark w-full rounded-[10px] border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm"
      />
    </div>
  );
}
