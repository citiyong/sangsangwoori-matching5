import { supabase } from "@/lib/supabase";
import type { Job, Senior } from "@/lib/supabase";

const REGION_SCORE = 3;
const JOB_TYPE_SCORE = 2;
const CAREER_SCORE = 1;

// 매칭 점수 계산 시 비교용으로만 쓰는 정규화. seniors/jobs 원본 값은 그대로 둔다.
// SQL의 normalize_region / normalize_job_type 함수와 규칙을 동일하게 맞춰야 한다.
const REGION_ALIASES: Record<string, string> = {
  "서울특별시": "서울",
  "경기도": "경기",
  "인천광역시": "인천",
};

const JOB_TYPE_ALIASES: Record<string, string> = {
  "경비직": "경비",
  "청소직": "청소",
  "조리직": "조리",
  "돌봄직": "돌봄",
};

function normalizeRegion(region: string): string {
  return REGION_ALIASES[region] ?? region;
}

function normalizeJobType(jobType: string): string {
  return JOB_TYPE_ALIASES[jobType] ?? jobType;
}

function calcScore(senior: Pick<Senior, "region" | "desired_job" | "career_years">, job: Pick<Job, "region" | "job_type" | "required_career">) {
  let score = 0;
  if (normalizeRegion(senior.region) === normalizeRegion(job.region)) score += REGION_SCORE;
  if (normalizeJobType(senior.desired_job) === normalizeJobType(job.job_type)) score += JOB_TYPE_SCORE;
  if (senior.career_years >= job.required_career) score += CAREER_SCORE;
  return score;
}

export type RecalcResult = { usedFallback: boolean };

// seniors 테이블 INSERT/UPDATE 이후 호출: 해당 시니어 × 전체 일자리 점수 재계산
export async function recalcMatchesForSenior(seniorId: string): Promise<RecalcResult> {
  const { error: rpcError } = await supabase.rpc("recalc_matches_for_senior", {
    p_senior_id: seniorId,
  });
  if (!rpcError) return { usedFallback: false };

  // RPC 함수 호출 실패 (권한/문법 문제 등) → 앱 레이어에서 직접 재계산
  const { data: senior } = await supabase
    .from("seniors")
    .select("*")
    .eq("id", seniorId)
    .single();
  if (!senior) return { usedFallback: true };

  const { data: jobs } = await supabase.from("jobs").select("*");
  const rows = (jobs ?? []).map((job) => ({
    senior_id: seniorId,
    job_id: job.id,
    score: calcScore(senior, job),
  }));

  if (rows.length > 0) {
    await supabase.from("matches").upsert(rows, { onConflict: "senior_id,job_id" });
  }
  return { usedFallback: true };
}

// jobs 테이블 INSERT/UPDATE 이후 호출: 해당 일자리 × 전체 시니어 점수 재계산
export async function recalcMatchesForJob(jobId: string): Promise<RecalcResult> {
  const { error: rpcError } = await supabase.rpc("recalc_matches_for_job", {
    p_job_id: jobId,
  });
  if (!rpcError) return { usedFallback: false };

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();
  if (!job) return { usedFallback: true };

  const { data: seniors } = await supabase.from("seniors").select("*");
  const rows = (seniors ?? []).map((senior) => ({
    senior_id: senior.id,
    job_id: jobId,
    score: calcScore(senior, job),
  }));

  if (rows.length > 0) {
    await supabase.from("matches").upsert(rows, { onConflict: "senior_id,job_id" });
  }
  return { usedFallback: true };
}
