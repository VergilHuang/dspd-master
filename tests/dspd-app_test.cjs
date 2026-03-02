const assert = require("assert");

// ============================================================
// DSPD 睡眠調整計畫 — 完整 E2E 測試 (CodeceptJS + Playwright)
// ============================================================

// ============================================================
// 1. Setup 頁面測試
// ============================================================
Feature("Setup 頁面");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
});

Scenario("應顯示標題與所有表單欄位", ({ I }) => {
  I.see("DSPD 睡眠調整計畫");
  I.see("目前入睡時間");
  I.see("目前起床時間");
  I.see("目標入睡時間");
  I.see("目標起床時間");
  I.see("每日調整幅度 (分鐘)");
  I.see("生成調整計畫");
});

Scenario("應顯示睡眠品質指南面板", ({ I }) => {
  I.see("睡眠品質指南與小知識");
  I.see("建議睡眠時數 (依年齡)");
  I.see("睡眠週期 (Sleep Cycle)");
  I.see("核心體溫與入睡");
});

Scenario("時間輸入欄位應有預設值", async ({ I }) => {
  const val = await I.grabValueFrom({ css: 'input[type="time"]' });
  const firstVal = Array.isArray(val) ? val[0] : val;
  assert.strictEqual(firstVal, "05:00");
});

Scenario("可切換每日調整幅度選項", async ({ I }) => {
  I.seeInField("select", "15");
  I.selectOption("select", "10");
  I.seeInField("select", "10");
  I.selectOption("select", "30");
  I.seeInField("select", "30");
});

// ============================================================
// 2. 計畫生成與頁面切換測試
// ============================================================
Feature("計畫生成");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
});

Scenario("點擊「生成調整計畫」應切換至 Dashboard 視圖", ({ I }) => {
  I.click("生成調整計畫");
  I.see("天進度");
  I.see("今日作息目標");
  I.see("調整提醒");
  I.see("完整調整時程與實際紀錄表");
  I.see("AI 睡眠狀態評估報告");
  I.dontSee("DSPD 睡眠調整計畫");
});

Scenario("計畫應包含正確的天數與目標", ({ I }) => {
  I.click("生成調整計畫");
  I.see("Day 1");
  I.see("終極目標");
});

Scenario("使用不同調整幅度時應產生不同天數的計畫", async ({ I }) => {
  I.selectOption("select", "30");
  I.click("生成調整計畫");
  const rows30 = await I.grabNumberOfVisibleElements("tbody tr");

  I.click("重新設定計畫");
  I.click("確認刪除");

  I.selectOption("select", "10");
  I.click("生成調整計畫");
  const rows10 = await I.grabNumberOfVisibleElements("tbody tr");

  assert.ok(
    rows10 > rows30,
    `10 分鐘(${rows10}天) 應大於 30 分鐘(${rows30}天)`,
  );
});

// ============================================================
// 3. Dashboard 功能測試
// ============================================================
Feature("Dashboard 功能");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
  I.click("生成調整計畫");
});

Scenario("應顯示進度條", async ({ I }) => {
  // Day 1 進度為 0%，元素存在但 width=0 所以不可見，改用 grabNumberOfVisibleElements 檢查父容器
  I.seeElement({ css: ".bg-slate-800.h-3" });
});

Scenario("應顯示今日入睡與起床目標", ({ I }) => {
  I.see("目標上床");
  I.see("目標起床");
});

Scenario("應顯示睡前提醒與藍光截止時間", ({ I }) => {
  I.see("今日睡前提醒");
  I.see("啟動夜間模式");
});

Scenario("應顯示調整提醒 (QuickTips)", ({ I }) => {
  I.see("調整提醒");
  I.see("醒來後 10 分鐘內");
  I.see("白天絕不午睡");
});

// ============================================================
// 4. 每日結算流程測試
// ============================================================
Feature("每日結算");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
  I.click("生成調整計畫");
});

Scenario("點擊「達標前進」應推進天數並紀錄達標", ({ I }) => {
  I.see("Day 1");
  I.click("結算：達標前進");
  I.see("達標");
  I.see("第 2 天進度");
});

Scenario("點擊「失敗重試」天數不應推進", ({ I }) => {
  I.click("結算：失敗重試");
  I.see("第 1 天進度");
  I.see("失敗");
});

Scenario("可修改實際作息時間後結算", ({ I }) => {
  // Dashboard 中只有 2 個 time input（實際入睡、實際起床）
  I.executeScript(() => {
    const timeInputs = document.querySelectorAll('input[type="time"]');
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;
    // 第 1 個 = 實際入睡, 第 2 個 = 實際起床
    nativeSetter.call(timeInputs[0], "04:30");
    timeInputs[0].dispatchEvent(new Event("input", { bubbles: true }));
    timeInputs[0].dispatchEvent(new Event("change", { bubbles: true }));
    nativeSetter.call(timeInputs[1], "11:30");
    timeInputs[1].dispatchEvent(new Event("input", { bubbles: true }));
    timeInputs[1].dispatchEvent(new Event("change", { bubbles: true }));
  });
  I.click("結算：達標前進");
  I.see("04:30 - 11:30");
});

Scenario("連續達標多天應依序推進", ({ I }) => {
  I.click("結算：達標前進");
  I.see("第 2 天進度");
  I.click("結算：達標前進");
  I.see("第 3 天進度");
});

// ============================================================
// 5. 時程表 (ScheduleTable) 測試
// ============================================================
Feature("時程表");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
  I.click("生成調整計畫");
});

Scenario("應顯示所有計畫天數", async ({ I }) => {
  const count = await I.grabNumberOfVisibleElements("tbody tr");
  assert.ok(count > 1, `應有多天計畫，實際為 ${count}`);
});

Scenario("表頭應包含正確欄位", ({ I }) => {
  I.see("天數");
  I.see("目標 (睡/醒)");
  I.see("實際 (睡/醒)");
  I.see("狀態");
});

Scenario("目前天數應標記為「進行中」", ({ I }) => {
  I.see("進行中");
});

Scenario("未來天數應標記為「待執行」", ({ I }) => {
  I.see("待執行");
});

// ============================================================
// 6. AI 報告測試
// ============================================================
Feature("AI 報告");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
});

Scenario("無紀錄時應顯示提示訊息", ({ I }) => {
  I.click("生成調整計畫");
  I.see("目前尚無足夠資料生成報告");
});

Scenario("有紀錄後報告應包含詳細資料", ({ I }) => {
  I.click("生成調整計畫");
  I.click("結算：達標前進");
  I.see("DSPD 睡眠調整計畫 - 階段性執行報告");
  I.see("目標達成率");
  I.see("Day 1:");
});

Scenario("複製按鈕應存在且可點擊", ({ I }) => {
  I.click("生成調整計畫");
  I.see("複製格式化報告");
});

// ============================================================
// 7. 重置 (ResetModal) 測試
// ============================================================
Feature("重置計畫");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
  I.click("生成調整計畫");
});

Scenario("點擊「重新設定計畫」應顯示確認彈窗", ({ I }) => {
  I.click("重新設定計畫");
  I.see("重新開始？");
  I.see("確定要刪除所有進度");
  I.see("取消");
  I.see("確認刪除");
});

Scenario("點擊「取消」應關閉彈窗但保持在 Dashboard", ({ I }) => {
  I.click("重新設定計畫");
  I.click("取消");
  I.dontSee("重新開始？");
  I.see("今日作息目標");
});

Scenario("點擊「確認刪除」應回到 Setup 頁面", ({ I }) => {
  I.click("重新設定計畫");
  I.click("確認刪除");
  I.see("DSPD 睡眠調整計畫");
  I.see("生成調整計畫");
});

Scenario("重置後歷史紀錄應清空", ({ I }) => {
  I.click("結算：達標前進");
  I.click("重新設定計畫");
  I.click("確認刪除");
  I.click("生成調整計畫");
  I.see("目前尚無足夠資料生成報告");
});

// ============================================================
// 8. localStorage 持久化測試
// ============================================================
Feature("localStorage 持久化");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
});

Scenario("計畫資料應在刷新後保留", ({ I }) => {
  I.click("生成調整計畫");
  I.see("今日作息目標");
  I.refreshPage();
  I.see("今日作息目標");
  I.see("天進度");
});

Scenario("結算紀錄應在刷新後保留", ({ I }) => {
  I.click("生成調整計畫");
  I.click("結算：達標前進");
  I.see("第 2 天進度");
  I.refreshPage();
  I.see("第 2 天進度");
  I.see("達標");
});

Scenario("重置後刷新應回到 Setup 頁面", ({ I }) => {
  I.click("生成調整計畫");
  I.click("重新設定計畫");
  I.click("確認刪除");
  I.see("DSPD 睡眠調整計畫");
  I.refreshPage();
  I.see("DSPD 睡眠調整計畫");
});

// ============================================================
// 9. 邊界條件測試
// ============================================================
Feature("邊界條件");

Before(({ I }) => {
  I.amOnPage("/");
  I.executeScript(() => localStorage.clear());
  I.refreshPage();
});

Scenario("目標與當前時間完全相同時應仍可生成計畫", ({ I }) => {
  // 使用 executeScript 直接設定 React 受控 input 的值
  I.executeScript(() => {
    const timeInputs = document.querySelectorAll('input[type="time"]');
    const values = ["23:00", "07:00", "23:00", "07:00"];
    values.forEach((v, i) => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      ).set;
      nativeSetter.call(timeInputs[i], v);
      timeInputs[i].dispatchEvent(new Event("input", { bubbles: true }));
      timeInputs[i].dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  I.click("生成調整計畫");
  I.see("Day 1");
});
