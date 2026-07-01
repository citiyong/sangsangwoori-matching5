import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">

        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-gray-900">상상우리</h1>
          <p className="text-2xl text-gray-600">시니어 일자리 매칭 시스템</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/register"
            className="block w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-2xl flex items-center justify-center transition-colors"
          >
            프로필 등록하기
          </Link>
          <Link
            href="/recommendations"
            className="block w-full h-16 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded-2xl flex items-center justify-center transition-colors"
          >
            추천 일자리 보기
          </Link>
          <Link
            href="/admin"
            className="block w-full h-16 bg-gray-700 hover:bg-gray-800 text-white text-2xl font-bold rounded-2xl flex items-center justify-center transition-colors"
          >
            담당자 대시보드
          </Link>
        </div>

      </div>
    </main>
  );
}
