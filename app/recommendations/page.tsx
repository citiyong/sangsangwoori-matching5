export default function RecommendationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 제목 */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">추천 일자리 목록</h1>
          <p className="text-xl text-gray-600">매칭 점수 높은 순으로 표시됩니다</p>
        </div>

        {/* 필터 자리 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
          <div className="h-12 flex-1 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center px-4 text-gray-400 text-lg">
            지역 필터 (준비 중)
          </div>
          <div className="h-12 flex-1 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center px-4 text-gray-400 text-lg">
            직종 필터 (준비 중)
          </div>
        </div>

        {/* 카드 목록 자리 — 기능 구현은 다음 단계 */}
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200 space-y-3 opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gray-200 rounded-lg" />
              <div className="h-10 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                점수 --
              </div>
            </div>
            <div className="h-5 w-32 bg-gray-100 rounded" />
            <div className="h-5 w-40 bg-gray-100 rounded" />
            <div className="h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              매칭 신청하기 (준비 중)
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}
