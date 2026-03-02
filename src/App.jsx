import { useState, useEffect, useCallback } from "react";
import { Calendar, RotateCcw } from "lucide-react";

// Utils
import { addMinutes } from "./utils/timeUtils";
import {
  loadPlanData,
  savePlanData,
  clearPlanData,
} from "./utils/localStorageHandler";
import { generatePlan } from "./utils/planGenerator";
import { generateReportText } from "./utils/reportGenerator";
import { copyToClipboard } from "./utils/clipboard";

// Components
import SetupForm from "./components/SetupForm";
import SleepGuide from "./components/SleepGuide";
import DayProgress from "./components/DayProgress";
import QuickTips from "./components/QuickTips";
import ScheduleTable from "./components/ScheduleTable";
import AIReport from "./components/AIReport";
import ResetModal from "./components/ResetModal";

const App = () => {
  // --- State ---
  const [sleepPlan, setSleepPlan] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
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

  // --- Persistence (localStorage) ---
  // 初始化：只在 mount 時讀取一次，屬於合理的 init side effect
  useEffect(() => {
    const saved = loadPlanData();
    if (saved) {
      setSleepPlan(saved.plan);
      setCurrentDayIndex(saved.currentDayIndex);
      setHistory(saved.history);
      setInputs(saved.inputs);
      // 同步初始化今日實際作息欄位
      if (saved.plan && saved.plan[saved.currentDayIndex]) {
        setActualSleep(saved.plan[saved.currentDayIndex].sleep);
        setActualWake(saved.plan[saved.currentDayIndex].wake);
      }
    }
  }, []);

  // --- Handlers ---
  const handleInputsChange = useCallback(
    (newInputs) => {
      setInputs(newInputs);
      // 同步持久化
      if (sleepPlan) {
        // Only save if a plan exists
        savePlanData({
          plan: sleepPlan,
          currentDayIndex,
          history,
          inputs: newInputs,
        });
      }
    },
    [sleepPlan, currentDayIndex, history],
  );

  const handleGeneratePlan = () => {
    const newPlan = generatePlan(inputs);
    setSleepPlan(newPlan);
    setCurrentDayIndex(0);
    setHistory([]);
    // 初始化今日實際作息欄位
    if (newPlan && newPlan[0]) {
      setActualSleep(newPlan[0].sleep);
      setActualWake(newPlan[0].wake);
    }
    // 同步持久化
    savePlanData({ plan: newPlan, currentDayIndex: 0, history: [], inputs });
  };

  const handleDayComplete = (success) => {
    const record = { success, actualSleep, actualWake };
    const newHistory = [...history, record];
    const newDayIndex =
      success && currentDayIndex < sleepPlan.length - 1
        ? currentDayIndex + 1
        : currentDayIndex;

    // 切換天數時直接同步今日預設作息（取代原本的 useEffect 派生邏輯）
    if (newDayIndex !== currentDayIndex && sleepPlan[newDayIndex]) {
      setActualSleep(sleepPlan[newDayIndex].sleep);
      setActualWake(sleepPlan[newDayIndex].wake);
    }

    setHistory(newHistory);
    setCurrentDayIndex(newDayIndex);
    // 事件驅動持久化
    savePlanData({
      plan: sleepPlan,
      currentDayIndex: newDayIndex,
      history: newHistory,
      inputs,
    });
  };

  const handleResetAll = () => {
    setSleepPlan(null);
    setCurrentDayIndex(0);
    setHistory([]);
    setActualSleep("");
    setActualWake("");
    setShowResetConfirm(false);
    // 事件驅動持久化
    clearPlanData();
  };

  const handleCopyReport = async () => {
    const reportContent = generateReportText({
      history,
      plan: sleepPlan,
      inputs,
      currentDayIndex,
    });
    const success = await copyToClipboard(reportContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Views ---

  // Setup View (沒有計畫時)
  if (!sleepPlan) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SetupForm
            inputs={inputs}
            onInputsChange={handleInputsChange}
            onGenerate={handleGeneratePlan}
          />
          <SleepGuide />
        </div>
      </div>
    );
  }

  // Dashboard View (有計畫時)
  const todayGoal = sleepPlan[currentDayIndex];
  const progressPercent = (currentDayIndex / (sleepPlan.length - 1)) * 100;
  const blueLightCutoff = addMinutes(todayGoal.sleep, -120);
  const reportContent = generateReportText({
    history,
    plan: sleepPlan,
    inputs,
    currentDayIndex,
  });

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
              終極目標：{sleepPlan[sleepPlan.length - 1].sleep} 入睡 /{" "}
              {sleepPlan[sleepPlan.length - 1].wake} 起床
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
          <DayProgress
            todayGoal={todayGoal}
            actualSleep={actualSleep}
            actualWake={actualWake}
            onActualSleepChange={setActualSleep}
            onActualWakeChange={setActualWake}
            onDayComplete={handleDayComplete}
            blueLightCutoff={blueLightCutoff}
          />
          <QuickTips />
        </div>

        <ScheduleTable
          plan={sleepPlan}
          history={history}
          currentDayIndex={currentDayIndex}
        />

        <AIReport
          reportContent={reportContent}
          onCopy={handleCopyReport}
          copied={copied}
        />
      </div>

      <ResetModal
        show={showResetConfirm}
        onConfirm={handleResetAll}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};

export default App;
