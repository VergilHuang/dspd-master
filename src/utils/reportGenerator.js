/**
 * AI 睡眠狀態評估報告生成器
 */
import { calculateDuration, formatDuration } from "./timeUtils";

/**
 * 生成供 AI 分析的格式化報告文字
 * @param {object} params
 * @param {Array} params.history - 歷史紀錄陣列
 * @param {Array} params.plan - 計畫陣列
 * @param {object} params.inputs - 使用者輸入參數
 * @param {number} params.currentDayIndex - 目前天數索引
 * @returns {string} 格式化報告文字
 */
export const generateReportText = ({
  history,
  plan,
  inputs,
  currentDayIndex,
}) => {
  if (!history.length) return "目前尚無足夠資料生成報告。";

  const totalDays = history.length;
  const successDays = history.filter((h) => h.success).length;
  const adherenceRate = ((successDays / totalDays) * 100).toFixed(1);

  let totalActualDuration = 0;
  let validRecords = 0;

  const detailLogs = history
    .map((record, idx) => {
      const p = plan[idx];
      if (!p) return null; // 防禦：history 超出 plan 範圍時跳過

      // 相容舊版 boolean 資料結構
      const actSleep = record.actualSleep || p.sleep;
      const actWake = record.actualWake || p.wake;
      const isSuccess = record.success !== undefined ? record.success : record;

      const duration = calculateDuration(actSleep, actWake);
      totalActualDuration += duration;
      validRecords++;

      return `Day ${idx + 1}:\n  - 目標: 入睡 ${p.sleep} | 起床 ${p.wake}\n  - 實際: 入睡 ${actSleep} | 起床 ${actWake}\n  - 實際時長: ${formatDuration(duration)}\n  - 狀態: ${isSuccess ? "✅ 達標" : "❌ 未達標"}`;
    })
    .filter(Boolean)
    .join("\n\n");

  const avgDuration = validRecords ? totalActualDuration / validRecords : 0;

  return `【DSPD 睡眠調整計畫 - 階段性執行報告】

[基本參數]
- 初始作息: 入睡 ${inputs.currentSleep} / 起床 ${inputs.currentWake}
- 最終目標: 入睡 ${inputs.targetSleep} / 起床 ${inputs.targetWake}
- 計畫設定每日偏移量: ${inputs.shiftPerDay} 分鐘

[目前指標 (Metrics)]
- 總紀錄天數: ${totalDays} 天
- 目標達成率 (Target Adherence): ${adherenceRate}%
- 平均在床時間 (Avg TIB): ${formatDuration(avgDuration)}
- 目前進度停留於計畫第 ${currentDayIndex + 1} 天

[每日詳細紀錄]
${detailLogs}

[使用者附註 / 疑問]
(請在此輸入你想讓 AI 特別注意的問題，例如：「我第一天睡兩小時就醒了，該退回原點嗎？」)
`;
};
