export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 제목 */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">담당자 대시보드</h1>
          <p className="text-xl text-gray-600">매칭 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 3개 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-red-400 space-y-1 opacity-50">
            <p className="text-lg text-gray-600 font-medium">미매칭</p>
            <p className="text-5xl font-bold text-red-500">--</p>
            <p className="text-gray-400">매칭 대기 중인 시니어</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-yellow-400 space-y-1 opacity-50">
            <p className="text-lg text-gray-600 font-medium">매칭 대기</p>
            <p className="text-5xl font-bold text-yellow-500">--</p>
            <p className="text-gray-400">검토 중인 매칭</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-green-400 space-y-1 opacity-50">
            <p className="text-lg text-gray-600 font-medium">배정 완료</p>
            <p className="text-5xl font-bold text-green-500">--</p>
            <p className="text-gray-400">배정 완료된 매칭</p>
          </div>
        </div>

        {/* 매칭 목록 테이블 자리 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden opacity-50">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">전체 매칭 목록</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                {["시니어 이름", "일자리", "지역", "점수", "상태", "처리"].map((h) => (
                  <th key={h} className="px-6 py-4 text-lg font-semibold text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((n) => (
                <tr key={n} className="border-t border-gray-100">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <td key={i} className="px-6 py-4">
                      <div className="h-5 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-center text-gray-400 text-lg">
            데이터 로딩 기능은 다음 단계에서 구현됩니다
          </div>
        </div>

      </div>
    </main>
  );
}
