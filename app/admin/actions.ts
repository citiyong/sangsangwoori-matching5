"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { recalcMatchesForJob } from "@/lib/matching";

export type JobFormState = {
  success: boolean;
  errors: {
    title?: string;
    region?: string;
    job_type?: string;
    form?: string;
  };
};

export async function addJob(
  _prevState: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const jobType = String(formData.get("job_type") ?? "").trim();
  const requiredCareer = Number(formData.get("required_career") ?? 0);

  const errors: JobFormState["errors"] = {};
  if (!title) errors.title = "공고명을 입력해주세요";
  if (!region) errors.region = "지역을 선택해주세요";
  if (!jobType) errors.job_type = "직종을 선택해주세요";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const { data: inserted, error } = await supabase
    .from("jobs")
    .insert({
      title,
      region,
      job_type: jobType,
      required_career: Number.isFinite(requiredCareer) ? requiredCareer : 0,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { success: false, errors: { form: error?.message ?? "저장 중 오류가 발생했습니다" } };
  }

  await recalcMatchesForJob(inserted.id);

  revalidatePath("/admin");
  return { success: true, errors: {} };
}

export async function deleteJob(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("jobs").delete().eq("id", id);
  revalidatePath("/admin");
}
