import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 테스트 러너 프로세스는 Next.js처럼 .env.local을 자동으로 읽지 않으므로 직접 로드한다.
function loadEnvLocal(): Record<string, string> {
  const envPath = path.resolve(__dirname, "..", ".env.local");
  const content = fs.readFileSync(envPath, "utf-8");
  const env: Record<string, string> = {};
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();

export const testSupabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 항상 거짓이 되지 않는 필터용 상수(PostgREST는 필터 없는 delete를 거부한다).
const NEVER_MATCHING_ID = "00000000-0000-0000-0000-000000000000";

export async function resetDb() {
  await testSupabase.from("matches").delete().neq("id", NEVER_MATCHING_ID);
  await testSupabase.from("seniors").delete().neq("id", NEVER_MATCHING_ID);
  await testSupabase.from("jobs").delete().neq("id", NEVER_MATCHING_ID);
}

export async function seedJob(job: {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}) {
  const { data, error } = await testSupabase
    .from("jobs")
    .insert(job)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function countSeniors(): Promise<number> {
  const { count } = await testSupabase
    .from("seniors")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}
