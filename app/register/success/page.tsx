import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">등록 완료!</h1>
        <p className="text-xl text-gray-600">프로필이 저장되었습니다.</p>
        <div className="space-y-4">
          <Link
            href="/recommendations"
            className="block w-full h-16 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded-2xl flex items-center justify-center transition-colors"
          >
            추천 일자리 보기
          </Link>
          <Link
            href="/"
            className="block w-full h-14 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-bold rounded-2xl flex items-center justify-center transition-colors"
          >
            처음으로
          </Link>
        </div>
      </div>
    </main>
  );
}
