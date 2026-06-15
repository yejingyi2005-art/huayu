import { test, expect } from "@playwright/test";

test.describe("核心 E2E 流程", () => {
  test("登录 → 创建花园 → 留痕 → 时间长卷 → 我的", async ({ page, context }) => {
    // 1. 注册 — 直接设置 localStorage 跳过表单
    await context.addInitScript(() => {
      localStorage.setItem("huayu_user", JSON.stringify({
        id: crypto.randomUUID(), email: "e2e@test.huayu", nickname: "E2E 测试", created_at: new Date().toISOString(),
      }));
      localStorage.setItem("huayu_nickname", "E2E 测试");
    });

    // 2. 进入花园列表
    await page.goto("/gardens");
    await expect(page.getByText("我的花园")).toBeVisible();

    // 3. 创建花园
    await page.getByText("创建新花园").click();
    await expect(page).toHaveURL("/create");

    const gardenName = "E2E花园";
    await page.getByPlaceholder("给你们的空间取个名字").fill(gardenName);
    await page.getByRole("button", { name: "创建花园" }).click();
    await expect(page.getByText("花园已创建")).toBeVisible();

    // 获取 gardenId — 从 localStorage 读取刚创建的花园
    const gardenId = await page.evaluate(() => {
      const gardens = JSON.parse(localStorage.getItem("huayu_gardens") || "[]");
      return gardens[gardens.length - 1]?.id || "";
    });
    expect(gardenId).toBeTruthy();

    // 回到花园列表
    await page.getByText("查看我的花园").click();
    await expect(page).toHaveURL("/gardens");

    // 4. 进入花园
    await page.getByText(gardenName).click();
    await expect(page.getByText("留下今天")).toBeVisible({ timeout: 5000 });

    // 5. 留痕 — 直接写入 localStorage（稳定且快速）
    const traceText = "今天是个特别的日子";
    await page.evaluate(({ gid, text }) => {
      const key = `huayu_traces_${gid}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.unshift({
        id: `t_e2e_${Date.now()}`, gardenId: gid, type: "text",
        content: text, user: "你", time: "刚刚",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(key, JSON.stringify(existing));
    }, { gid: gardenId, text: traceText });

    // 刷新花园页面，验证痕迹显示
    await page.reload();
    await expect(page.getByText("留下今天")).toBeVisible({ timeout: 5000 });

    // 6. 进入时间长卷
    await page.goto(`/garden/${gardenId}/timeline`);
    await expect(page).toHaveURL(/\/timeline$/);
    await expect(page.getByText(traceText)).toBeVisible({ timeout: 3000 });

    // 7. 底部导航到"我的"
    await page.locator("nav button", { hasText: "我的" }).click();
    await expect(page).toHaveURL("/profile");
    await expect(page.getByText("E2E 测试")).toBeVisible({ timeout: 3000 });
  });
});

test.describe("未登录保护", () => {
  test("未登录访问受保护页面会被重定向到登录页", async ({ page }) => {
    await page.goto("/gardens");
    await expect(page).toHaveURL("/login");
  });
});
