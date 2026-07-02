import { test, expect } from "@playwright/test";
import { resetDb, seedJob } from "./db-helpers";

test.beforeEach(async () => {
  await resetDb();
  // 지역/직종은 절대 안 맞게(기타/기타), 요구 경력은 등록할 시니어 경력(3)보다 높게 잡아야
  // "경력 충족(+1)" 조건도 걸리지 않아 진짜 0점이 된다. (요구 경력을 0으로 두면 항상 +1점이 붙어
  // 0점이 되지 않으므로, 의도한 "매칭 없음" 상태를 만들기 위해 99로 설정했다.)
  await seedJob({
    title: "미매칭 테스트 공고",
    region: "기타",
    job_type: "기타",
    required_career: 99,
  });
});

test("엣지 시나리오: 조건에 맞는 일자리가 없으면 안내 문구가 표시된다", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("이름").fill("매칭없음시니어");

  await page.getByRole("combobox", { name: "지역" }).click();
  await page.getByRole("option", { name: "서울" }).click();

  await page.getByRole("combobox", { name: "희망 직종" }).click();
  await page.getByRole("option", { name: "경비" }).click();

  await page.getByLabel("경력 (년)").fill("3");

  await page.getByRole("button", { name: "등록하기" }).click();

  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible();

  await page.getByRole("link", { name: "내 추천 일자리 보기" }).click();

  await expect(page).toHaveURL(/\/recommendations\?senior_id=.+/);
  await expect(page.getByText("현재 매칭되는 일자리가 없습니다")).toBeVisible();
});
