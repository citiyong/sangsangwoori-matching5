"use server";

import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function registerSenior(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const desiredJob = String(formData.get("desired_job") ?? "").trim();
  const careerYears = Number(formData.get("career_years") ?? 0);

  if (!name || !region || !desiredJob) {
    throw new Error("필수 항목을 모두 입력해주세요");
  }

  const { error } = await supabase.from("seniors").insert({
    name,
    region,
    desired_job: desiredJob,
    career_years: careerYears,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/register/success");
}
