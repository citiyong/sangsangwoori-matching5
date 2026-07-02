import { test, expect } from "@playwright/test";
import { resetDb, seedJob } from "./db-helpers";

test.beforeEach(async () => {
  await resetDb();
  await seedJob({
    title: "경비원 모집",
    region: "서울",
    job_type: "경비",
    required_career: 3,
  });
});

test("정상 시나리오: 등록 후 6점 매칭 카드가 추천 목록에 표시된다", async ({ page }) => {
  await page.goto("/register");

  await page.getByLabel("이름").fill("테스트시니어");

  await page.getByRole("combobox", { name: "지역" }).click();
  await page.getByRole("option", { name: "서울" }).click();

  await page.getByRole("combobox", { name: "희망 직종" }).click();
  await page.getByRole("option", { name: "경비" }).click();

  await page.getByLabel("경력 (년)").fill("5");

  await page.getByRole("button", { name: "등록하기" }).click();

  await expect(page.getByText("등록이 완료되었습니다")).toBeVisible();

  await page.getByRole("link", { name: "내 추천 일자리 보기" }).click();

  await expect(page).toHaveURL(/\/recommendations\?senior_id=.+/);
  await expect(page.getByText("경비원 모집")).toBeVisible();

  const scoreBadge = page.getByText("점수 6");
  await expect(scoreBadge).toBeVisible();
  await expect(scoreBadge).toHaveClass(/bg-yellow-400/);
});
