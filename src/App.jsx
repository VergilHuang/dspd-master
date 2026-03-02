import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Moon,
  Sun,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Info,
  RotateCcw,
  Bell,
  AlertTriangle,
  Thermometer,
  Activity,
  Brain,
  ClipboardCopy,
  FileText,
} from "lucide-react";

// --- Utility Functions ---

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const roundedMinutes = Math.round(totalMinutes);
  const normalized = (roundedMinutes + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const calculateDiff = (current, target) => {
  let diff = timeToMinutes(target) - timeToMinutes(current);
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
};

const addMinutes = (timeStr, mins) => {
  const m = timeToMinutes(timeStr) + mins;
  return minutesToTime(m);
};

// 計算兩個時間點之間的持續時間(分鐘)，考量跨日
const calculateDuration = (sleepTime, wakeTime) => {
  let sleepMins = timeToMinutes(sleepTime);
  let wakeMins = timeToMinutes(wakeTime);
  if (wakeMins < sleepMins) {
    wakeMins += 1440; // 跨夜
  }
  return wakeMins - sleepMins;
};

// 格式化分鐘為小時與分鐘
const formatDuration = (mins) => {
  if (isNaN(mins)) return "0h 0m";
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${h}h ${m}m`;
};

// --- Components ---

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl ${className}`}
  >
    {children}
  </div>
);

const App = () => {
  // --- State ---
  const [plan, setPlan] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  // history 現在儲存物件: { success: boolean, actualSleep: string, actualWake: string }
  const [history, setHistory] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // 今日實際作息輸入狀態
  const [actualSleep, setActualSleep] = useState("");
  const [actualWake, setActualWake] = useState("");
  const [copied, setCopied] = useState(false);

  // Setup Form State
  const [inputs, setInputs] = useState({
    currentSleep: "05:00",
    currentWake: "12:00",
    targetSleep: "23:30",
    targetWake: "07:30",
    shiftPerDay: 15,
  });

  // 每次切換天數時，自動將輸入框預設為當天的目標時間
  useEffect(() => {
    if (plan && plan[currentDayIndex]) {
      setActualSleep(plan[currentDayIndex].sleep);
      setActualWake(plan[currentDayIndex].wake);
    }
  }, [currentDayIndex, plan]);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem("dspd_plan_data_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlan(parsed.plan);
      setCurrentDayIndex(parsed.currentDayIndex);
      setHistory(parsed.history);
      setInputs(parsed.inputs);
    }
  }, []);

  useEffect(() => {
    if (plan) {
      localStorage.setItem(
        "dspd_plan_data_v2",
        JSON.stringify({
          plan,
          currentDayIndex,
          history,
          inputs,
        }),
      );
    } else {
      localStorage.removeItem("dspd_plan_data_v2");
    }
  }, [plan, currentDayIndex, history, inputs]);

  // --- Logic ---
  const generatePlan = () => {
    const sleepDiff = calculateDiff(inputs.currentSleep, inputs.targetSleep);
    const wakeDiff = calculateDiff(inputs.currentWake, inputs.targetWake);

    const maxDiff = Math.max(Math.abs(sleepDiff), Math.abs(wakeDiff));
    const daysNeeded = Math.ceil(maxDiff / inputs.shiftPerDay);

    const newPlan = [];
    const startSleepMin = timeToMinutes(inputs.currentSleep);
    const startWakeMin = timeToMinutes(inputs.currentWake);

    for (let i = 0; i <= daysNeeded; i++) {
      const ratio = i / daysNeeded;
      newPlan.push({
        day: i + 1,
        sleep: minutesToTime(startSleepMin + sleepDiff * ratio),
        wake: minutesToTime(startWakeMin + wakeDiff * ratio),
      });
    }

    setPlan(newPlan);
    setCurrentDayIndex(0);
    setHistory([]);
  };

  const handleDayComplete = (success) => {
    const record = {
      success,
      actualSleep,
      actualWake,
    };
    const newHistory = [...history, record];
    setHistory(newHistory);

    if (success && currentDayIndex < plan.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const resetAll = () => {
    setPlan(null);
    setCurrentDayIndex(0);
    setHistory([]);
    setShowResetConfirm(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for iframe environments
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 生成供 AI 分析的報告
  const generateReportText = () => {
    if (!history.length) return "目前尚無足夠資料生成報告。";

    const totalDays = history.length;
    const successDays = history.filter((h) => h.success).length;
    const adherenceRate = ((successDays / totalDays) * 100).toFixed(1);

    let totalActualDuration = 0;
    let validRecords = 0;

    const detailLogs = history
      .map((record, idx) => {
        const p = plan[idx];
        // 相容舊版 boolean 資料結構
        const actSleep = record.actualSleep || p.sleep;
        const actWake = record.actualWake || p.wake;
        const isSuccess =
          record.success !== undefined ? record.success : record;

        const duration = calculateDuration(actSleep, actWake);
        totalActualDuration += duration;
        validRecords++;

        return `Day ${idx + 1}:\n  - 目標: 入睡 ${p.sleep} | 起床 ${p.wake}\n  - 實際: 入睡 ${actSleep} | 起床 ${actWake}\n  - 實際時長: ${formatDuration(duration)}\n  - 狀態: ${isSuccess ? "✅ 達標" : "❌ 未達標"}`;
      })
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

  // --- Views ---

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：設定表單 */}
          <Card className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="text-indigo-400 w-8 h-8" />
              <h1 className="text-2xl font-bold">DSPD 睡眠調整計畫</h1>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    目前入睡時間
                  </label>
                  <input
                    type="time"
                    className="w-full bg-slate-700 border-none rounded-lg p-2 text-white"
                    value={inputs.currentSleep}
                    onChange={(e) =>
                      setInputs({ ...inputs, currentSleep: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    目前起床時間
                  </label>
                  <input
                    type="time"
                    className="w-full bg-slate-700 border-none rounded-lg p-2 text-white"
                    value={inputs.currentWake}
                    onChange={(e) =>
                      setInputs({ ...inputs, currentWake: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    目標入睡時間
                  </label>
                  <input
                    type="time"
                    className="w-full bg-slate-700 border-none rounded-lg p-2 text-white"
                    value={inputs.targetSleep}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetSleep: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    目標起床時間
                  </label>
                  <input
                    type="time"
                    className="w-full bg-slate-700 border-none rounded-lg p-2 text-white"
                    value={inputs.targetWake}
                    onChange={(e) =>
                      setInputs({ ...inputs, targetWake: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  每日調整幅度 (分鐘)
                </label>
                <select
                  className="w-full bg-slate-700 border-none rounded-lg p-2 text-white"
                  value={inputs.shiftPerDay}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      shiftPerDay: Number(e.target.value),
                    })
                  }
                >
                  <option value={10}>10 分鐘 (極度穩定)</option>
                  <option value={15}>15 分鐘 (建議)</option>
                  <option value={30}>30 分鐘 (較快)</option>
                </select>
              </div>

              <button
                onClick={generatePlan}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors mt-4"
              >
                生成調整計畫
              </button>
            </div>
          </Card>

          {/* 右側：睡眠指南 */}
          <Card className="bg-indigo-900/20 border-indigo-500/30 flex flex-col justify-center">
            <h2 className="flex items-center gap-2 text-xl text-indigo-300 font-bold mb-6">
              <Brain size={24} /> 睡眠品質指南與小知識
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-400" /> 建議睡眠時數
                  (依年齡)
                </h3>
                <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
                  <li>
                    <strong className="text-slate-300">14-17 歲：</strong> 8 到
                    10 小時
                  </li>
                  <li>
                    <strong className="text-slate-300">
                      18-64 歲 (成人)：
                    </strong>{" "}
                    7 到 9 小時
                  </li>
                  <li>
                    <strong className="text-slate-300">65 歲以上：</strong> 7 到
                    8 小時
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" /> 睡眠週期
                  (Sleep Cycle)
                </h3>
                <p className="text-sm text-slate-400 mb-2">
                  人類的睡眠以約 <strong>90 分鐘</strong> 為週期循環：
                </p>
                <ul className="text-sm text-slate-400 space-y-2 ml-6">
                  <li>
                    <span className="text-amber-300 font-bold">
                      NREM (非快速動眼期)：
                    </span>{" "}
                    深度休息、組織修復。
                  </li>
                  <li>
                    <span className="text-amber-300 font-bold">
                      REM (快速動眼期)：
                    </span>{" "}
                    大腦活躍，負責整理記憶與情緒。
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
                  <Thermometer size={16} className="text-indigo-400" />{" "}
                  核心體溫與入睡
                </h3>
                <p className="text-sm text-slate-400">
                  針對<strong>亞熱帶地區</strong>，建議將室溫設定在{" "}
                  <strong>23°C - 26°C</strong>，並將相對濕度控制在{" "}
                  <strong>50% - 60%</strong> 幫助核心體溫下降。
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const todayGoal = plan[currentDayIndex];
  const progressPercent = (currentDayIndex / (plan.length - 1)) * 100;
  const blueLightCutoff = addMinutes(todayGoal.sleep, -120);
  const reportContent = generateReportText();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="text-indigo-400" />第 {todayGoal.day} 天進度
            </h1>
            <p className="text-slate-400">
              終極目標：{plan[plan.length - 1].sleep} 入睡 /{" "}
              {plan[plan.length - 1].wake} 起床
            </p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw size={16} /> 重新設定計畫
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Goal & Input Card */}
          <Card className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg text-slate-400 mb-4 font-medium uppercase tracking-wider">
                今日作息目標
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <Moon className="mx-auto mb-2 text-indigo-300" size={32} />
                  <div className="text-3xl font-mono font-bold">
                    {todayGoal.sleep}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">目標上床</div>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                  <Sun className="mx-auto mb-2 text-amber-300" size={32} />
                  <div className="text-3xl font-mono font-bold">
                    {todayGoal.wake}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">目標起床</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl mb-6 border border-slate-700">
              <h3 className="text-sm font-bold text-slate-300 mb-3">
                記錄昨晚實際作息
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    實際入睡
                  </label>
                  <input
                    type="time"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
                    value={actualSleep}
                    onChange={(e) => setActualSleep(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    實際起床
                  </label>
                  <input
                    type="time"
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
                    value={actualWake}
                    onChange={(e) => setActualWake(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleDayComplete(true)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold transition-all active:scale-95"
                >
                  <CheckCircle2 size={20} /> 結算：達標前進
                </button>
                <button
                  onClick={() => handleDayComplete(false)}
                  className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-4 rounded-xl font-bold transition-all active:scale-95"
                >
                  <XCircle size={20} /> 結算：失敗重試
                </button>
              </div>
            </div>

            <div className="mt-6 bg-indigo-900/40 border border-indigo-500/30 rounded-xl p-4 flex items-start md:items-center gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg shrink-0">
                <Bell className="text-indigo-400" size={24} />
              </div>
              <div>
                <div className="text-sm text-indigo-300 font-bold mb-1">
                  今日睡前提醒
                </div>
                <div className="text-slate-300 text-sm">
                  預計{" "}
                  <span className="font-mono font-bold text-amber-300">
                    {todayGoal.sleep}
                  </span>{" "}
                  就寢，請在{" "}
                  <span className="font-mono font-bold text-amber-300">
                    {blueLightCutoff}
                  </span>{" "}
                  啟動夜間模式。
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Tips Card */}
          <Card className="bg-indigo-900/20 border-indigo-500/30 h-full">
            <h3 className="flex items-center gap-2 text-indigo-300 font-bold mb-4">
              <Info size={18} /> 調整提醒
            </h3>
            <ul className="text-sm space-y-4 text-slate-300">
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">1.</span>
                <span>醒來後 10 分鐘內，接收陽光 15-30 分鐘重設生理時鐘。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">2.</span>
                <span>白天絕不午睡，以累積足夠的睡眠壓力。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400 font-bold">3.</span>
                <span>
                  若提早醒來（如睡 3
                  小時就醒），請保持環境昏暗，不要滑手機，讓身體盡量維持在休息狀態。
                </span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Full Schedule List */}
        <Card className="overflow-hidden p-0">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-lg font-bold">完整調整時程與實際紀錄表</h2>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 sticky top-0 z-10">
                <tr>
                  <th className="p-4">天數</th>
                  <th className="p-4 text-indigo-300">目標 (睡/醒)</th>
                  <th className="p-4 text-amber-300">實際 (睡/醒)</th>
                  <th className="p-4">狀態</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {plan.map((d, idx) => {
                  const isPast = idx < history.length;
                  const isCurrent = idx === currentDayIndex;
                  const record = history[idx];

                  // 向下相容舊資料結構
                  let actSleep = "--:--";
                  let actWake = "--:--";
                  let isSuccess = false;

                  if (isPast) {
                    actSleep = record.actualSleep || d.sleep;
                    actWake = record.actualWake || d.wake;
                    isSuccess =
                      record.success !== undefined ? record.success : record;
                  }

                  return (
                    <tr
                      key={idx}
                      className={`${isCurrent ? "bg-indigo-500/10" : ""} ${isPast ? "opacity-80" : ""}`}
                    >
                      <td className="p-4 font-mono">Day {d.day}</td>
                      <td className="p-4 font-mono text-slate-300">
                        {d.sleep} - {d.wake}
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        {isPast ? `${actSleep} - ${actWake}` : "-"}
                      </td>
                      <td className="p-4">
                        {isPast ? (
                          isSuccess ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={14} /> 達標
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle size={14} /> 失敗
                            </span>
                          )
                        ) : isCurrent ? (
                          <span className="text-indigo-400 font-bold">
                            進行中
                          </span>
                        ) : (
                          <span className="text-slate-600">待執行</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Analysis Report Generator */}
        <Card className="bg-slate-900 border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="text-indigo-400" />
              AI 睡眠狀態評估報告
            </h2>
            <button
              onClick={() => copyToClipboard(reportContent)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              {copied ? (
                <CheckCircle2 size={16} />
              ) : (
                <ClipboardCopy size={16} />
              )}
              {copied ? "已複製到剪貼簿" : "複製格式化報告"}
            </button>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            將此格式化報告複製並貼給 AI（如 ChatGPT /
            Claude），要求其根據紀錄評估你的「睡眠效率」並給予下一步的作息調整建議。
          </p>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
              {reportContent}
            </pre>
          </div>
        </Card>
      </div>

      {/* Custom Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">重新開始？</h3>
            </div>
            <p className="text-slate-300 mb-6">
              確定要刪除所有進度並重新設定計畫嗎？此動作無法復原。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
