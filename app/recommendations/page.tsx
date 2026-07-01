import Link from "next/link";
import { supabase } from "@/lib/supabase";

type MatchWithJob = {
  id: string;
  score: number;
  status: string;
  jobs: {
    title: string;
    region: string;
    job_type: string;
  } | null;
};

function ScoreBadge({ score }: { score: number }) {
  const className =
    score === 6
      ? "bg-yellow-400 text-yellow-950"
      : score >= 4
      ? "bg-green-500 text-white"
      : "bg-gray-300 text-gray-700";

  return (
    <span
      className={`h-10 px-4 rounded-full flex items-center justify-center font-bold text-lg ${className}`}
    >
      점수 {score}
    </span>
  );
}

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ senior_id?: string }>;
}) {
  const { senior_id: seniorId } = await searchParams;

  if (!seniorId) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 text-center space-y-4">
          <p className="text-xl text-gray-700 font-semibold">
            확인할 시니어가 지정되지 않았습니다
          </p>
          <Link
            href="/register"
            className="inline-block h-14 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl flex items-center justify-center"
          >
            프로필 등록하러 가기
          </Link>
        </div>
      </main>
    );
  }

  const { data } = await supabase
    .from("matches")
    .select("id, score, status, jobs(title, region, job_type)")
    .eq("senior_id", seniorId)
    .order("score", { ascending: false });

  const matches = (data ?? []) as unknown as MatchWithJob[];
  const results = matches.filter((m) => m.score > 0);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 제목 */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-gray-900">추천 일자리 목록</h1>
          <p className="text-xl text-gray-600">매칭 점수 높은 순으로 표시됩니다</p>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-xl text-gray-500">현재 매칭되는 일자리가 없습니다</p>
          </div>
        ) : (
          results.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-gray-900">{m.jobs?.title}</h3>
                <ScoreBadge score={m.score} />
              </div>
              <p className="text-lg text-gray-600">지역: {m.jobs?.region}</p>
              <p className="text-lg text-gray-600">직종: {m.jobs?.job_type}</p>
            </div>
          ))
        )}

      </div>
    </main>
  );
}
