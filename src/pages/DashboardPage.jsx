import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, RotateCcw } from "lucide-react";
import { usePlanStore } from "../store/usePlanStore";
import { addMinutes } from "../utils/timeUtils";
import { generateReportText } from "../utils/reportGenerator";
import { copyToClipboard } from "../utils/clipboard";

// Components
import DayProgress from "../components/DayProgress";
import QuickTips from "../components/QuickTips";
import ScheduleTable from "../components/ScheduleTable";
import AIReport from "../components/AIReport";
import ResetModal from "../components/ResetModal";
import SuccessScreen from "../components/SuccessScreen";

const DashboardPage = () => {
  const navigate = useNavigate();
  const sleepPlan = usePlanStore((s) => s.sleepPlan);
  const currentDayIndex = usePlanStore((s) => s.currentDayIndex);
  const history = usePlanStore((s) => s.history);
  const inputs = usePlanStore((s) => s.inputs);
  const resetAll = usePlanStore((s) => s.resetAll);
  const isFinished = usePlanStore((s) => s.isFinished);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  // 若尚未有計畫，自動導向至 Setup
  useEffect(() => {
    if (!sleepPlan) {
      navigate("/");
    }
  }, [sleepPlan, navigate]);

  if (!sleepPlan) return null; // 攔截跳轉前的渲染

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
        <SuccessScreen />
      </div>
    );
  }

  const todayGoal = sleepPlan[currentDayIndex];
  const progressPercent = (currentDayIndex / (sleepPlan.length - 1)) * 100;
  const blueLightCutoff = addMinutes(todayGoal.sleep, -120);
  const reportContent = generateReportText({
    history,
    plan: sleepPlan,
    inputs,
    currentDayIndex,
  });

  const handleCopyReport = async () => {
    const success = await copyToClipboard(reportContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirmReset = () => {
    resetAll();
    setShowResetConfirm(false);
    // 重設後狀態會變，useEffect 會自動將其導向 '/'
  };

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
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};

export default DashboardPage;
