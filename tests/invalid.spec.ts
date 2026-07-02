import { test, expect } from "@playwright/test";
import { resetDb, countSeniors } from "./db-helpers";

test.beforeEach(async () => {
  await resetDb();
});

test("실패 시나리오: 이름 누락 시 저장이 차단되고 안내 문구가 표시된다", async ({ page }) => {
  await page.goto("/register");

  // 이름은 비워둔다.

  await page.getByRole("combobox", { name: "지역" }).click();
  await page.getByRole("option", { name: "서울" }).click();

  await page.getByRole("combobox", { name: "희망 직종" }).click();
  await page.getByRole("option", { name: "경비" }).click();

  await page.getByLabel("경력 (년)").fill("3");

  await page.getByRole("button", { name: "등록하기" }).click();

  await expect(page.getByText("이름을 입력해주세요")).toBeVisible();

  expect(await countSeniors()).toBe(0);
});
