import { supabase } from "@/lib/supabase";
import type { Job, Senior } from "@/lib/supabase";

const REGION_SCORE = 3;
const JOB_TYPE_SCORE = 2;
const CAREER_SCORE = 1;

function calcScore(senior: Pick<Senior, "region" | "desired_job" | "career_years">, job: Pick<Job, "region" | "job_type" | "required_career">) {
  let score = 0;
  if (senior.region === job.region) score += REGION_SCORE;
  if (senior.desired_job === job.job_type) score += JOB_TYPE_SCORE;
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
