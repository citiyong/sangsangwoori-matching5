"use server";

import { supabase } from "@/lib/supabase";
import { recalcMatchesForSenior } from "@/lib/matching";

export type RegisterState = {
  success: boolean;
  seniorId?: string;
  errors: {
    name?: string;
    region?: string;
    desired_job?: string;
    form?: string;
  };
};

export async function registerSenior(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const desiredJob = String(formData.get("desired_job") ?? "").trim();
  const careerYears = Number(formData.get("career_years") ?? 0);

  const errors: RegisterState["errors"] = {};
  if (!name) errors.name = "이름을 입력해주세요";
  if (!region) errors.region = "지역을 선택해주세요";
  if (!desiredJob) errors.desired_job = "희망 직종을 선택해주세요";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const { data: inserted, error } = await supabase
    .from("seniors")
    .insert({
      name,
      region,
      desired_job: desiredJob,
      career_years: Number.isFinite(careerYears) ? careerYears : 0,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { success: false, errors: { form: error?.message ?? "저장 중 오류가 발생했습니다" } };
  }

  await recalcMatchesForSenior(inserted.id);

  return { success: true, seniorId: inserted.id, errors: {} };
}
