import { registerSenior } from "./actions";

const REGIONS = [
  "서울", "경기", "인천", "강원", "충북", "충남", "대전", "세종",
  "전북", "전남", "광주", "경북", "경남", "대구", "울산", "부산", "제주",
];

const JOB_TYPES = [
  "사무보조", "매장관리/판매", "요양보호/돌봄", "경비/시설관리",
  "배달/운전", "급식/조리보조", "상담/안내", "기타",
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 space-y-8">

        {/* 제목 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">프로필 등록</h1>
          <p className="text-xl text-gray-600">일자리 매칭을 위한 정보를 입력해 주세요</p>
        </div>

        <form action={registerSenior} className="space-y-6">

          <div className="space-y-2">
            <label htmlFor="name" className="text-xl font-semibold text-gray-800">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="이름을 입력하세요"
              className="w-full h-14 bg-white rounded-xl border-2 border-gray-300 px-4 text-gray-900 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="region" className="text-xl font-semibold text-gray-800">지역</label>
            <select
              id="region"
              name="region"
              required
              defaultValue=""
              className="w-full h-14 bg-white rounded-xl border-2 border-gray-300 px-4 text-gray-900 text-lg focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>거주 지역을 선택하세요</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="desired_job" className="text-xl font-semibold text-gray-800">희망 직종</label>
            <select
              id="desired_job"
              name="desired_job"
              required
              defaultValue=""
              className="w-full h-14 bg-white rounded-xl border-2 border-gray-300 px-4 text-gray-900 text-lg focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>희망하는 직종을 선택하세요</option>
              {JOB_TYPES.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="career_years" className="text-xl font-semibold text-gray-800">경력 (년)</label>
            <input
              id="career_years"
              name="career_years"
              type="number"
              min={0}
              defaultValue={0}
              required
              placeholder="경력 연수를 입력하세요"
              className="w-full h-14 bg-white rounded-xl border-2 border-gray-300 px-4 text-gray-900 text-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold transition-colors"
          >
            등록하기
          </button>

        </form>
      </div>
    </main>
  );
}
