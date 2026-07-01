import Link from "next/link";
import { connection } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Job, Senior } from "@/lib/supabase";
import { JobsManager } from "./jobs-manager";

type SeniorStatus = "unmatched" | "pending" | "assigned";

const STATUS_LABEL: Record<SeniorStatus, string> = {
  unmatched: "미매칭",
  pending: "매칭 대기",
  assigned: "배정 완료",
};

const STATUS_BADGE_CLASS: Record<SeniorStatus, string> = {
  unmatched: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  assigned: "bg-green-100 text-green-700",
};

export default async function AdminPage() {
  await connection();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: seniors } = await supabase
    .from("seniors")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: matches } = await supabase
    .from("matches")
    .select("senior_id, score, status");

  // 시니어별로 가장 점수가 높은 매칭 1건을 골라 대표 상태를 정한다.
  const bestBySenior = new Map<string, { score: number; status: string }>();
  for (const m of matches ?? []) {
    const current = bestBySenior.get(m.senior_id);
    if (!current || m.score > current.score) {
      bestBySenior.set(m.senior_id, { score: m.score, status: m.status });
    }
  }

  function classify(best?: { score: number; status: string }): SeniorStatus {
    if (!best || best.score === 0) return "unmatched";
    if (best.status === "assigned" || best.status === "done") return "assigned";
    return "pending";
  }

  const stats = { unmatched: 0, pending: 0, assigned: 0 };
  for (const s of seniors ?? []) {
    stats[classify(bestBySenior.get(s.id))]++;
  }

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
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-red-400 space-y-1">
            <p className="text-lg text-gray-600 font-medium">미매칭</p>
            <p className="text-5xl font-bold text-red-500">{stats.unmatched}</p>
            <p className="text-gray-400">매칭되는 일자리가 없는 시니어</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-yellow-400 space-y-1">
            <p className="text-lg text-gray-600 font-medium">매칭 대기</p>
            <p className="text-5xl font-bold text-yellow-500">{stats.pending}</p>
            <p className="text-gray-400">검토 중인 매칭</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-8 border-green-400 space-y-1">
            <p className="text-lg text-gray-600 font-medium">배정 완료</p>
            <p className="text-5xl font-bold text-green-500">{stats.assigned}</p>
            <p className="text-gray-400">배정 완료된 시니어</p>
          </div>
        </div>

        {/* 시니어 목록 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">시니어 목록</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                {["이름", "지역", "희망 직종", "최고 매칭 점수", "상태", "상세"].map((h) => (
                  <th key={h} className="px-6 py-4 text-lg font-semibold text-gray-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(seniors ?? []).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-lg">
                    등록된 시니어가 없습니다
                  </td>
                </tr>
              )}
              {((seniors ?? []) as Senior[]).map((senior) => {
                const best = bestBySenior.get(senior.id);
                const status = classify(best);
                return (
                  <tr key={senior.id} className="border-t border-gray-100">
                    <td className="px-6 py-4 text-lg text-gray-900">{senior.name}</td>
                    <td className="px-6 py-4 text-lg text-gray-700">{senior.region}</td>
                    <td className="px-6 py-4 text-lg text-gray-700">{senior.desired_job}</td>
                    <td className="px-6 py-4 text-lg text-gray-700">{best ? best.score : "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-base font-semibold ${STATUS_BADGE_CLASS[status]}`}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/recommendations?senior_id=${senior.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline"
                      >
                        상세 보기
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <JobsManager jobs={(jobs ?? []) as Job[]} />

      </div>
    </main>
  );
}
