import { useState, useEffect } from "react";
import { Moon, Sun, CheckCircle2, XCircle, Bell } from "lucide-react";
import { usePlanStore } from "@/store/usePlanStore";
import Card from "@/components/Card";

const DayProgress = ({ todayGoal, blueLightCutoff }) => {
  const completeDay = usePlanStore((s) => s.completeDay);

  const [actualSleep, setActualSleep] = useState(todayGoal.sleep);
  const [actualWake, setActualWake] = useState(todayGoal.wake);

  useEffect(() => {
    setActualSleep(todayGoal.sleep);
    setActualWake(todayGoal.wake);
  }, [todayGoal]);

  const handleDayComplete = (success) => {
    completeDay(success, actualSleep, actualWake);
  };

  return (
    <Card className="md:col-span-2 flex flex-col justify-between">
      <div>
        <h2 className="text-lg text-text-muted mb-4 font-medium uppercase tracking-wider">
          今日作息目標
        </h2>
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="text-center p-4 bg-bg-base/50 rounded-xl">
            <Moon className="mx-auto mb-2 text-primary-subtle" size={32} />
            <div className="text-3xl font-mono font-bold">
              {todayGoal.sleep}
            </div>
            <div className="text-xs text-text-faint mt-1">目標上床</div>
          </div>
          <div className="text-center p-4 bg-bg-base/50 rounded-xl">
            <Sun className="mx-auto mb-2 text-warning-subtle" size={32} />
            <div className="text-3xl font-mono font-bold">{todayGoal.wake}</div>
            <div className="text-xs text-text-faint mt-1">目標起床</div>
          </div>
        </div>
      </div>

      <div className="bg-bg-base/40 p-4 rounded-xl mb-6 border border-border">
        <h3 className="text-sm font-bold text-text-secondary mb-3">
          記錄昨晚實際作息
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-faint mb-1">
              實際入睡
            </label>
            <input
              type="time"
              className="w-full bg-bg-surface border border-border-subtle rounded-lg p-2 text-white focus:border-primary focus:outline-none"
              value={actualSleep}
              onChange={(e) => setActualSleep(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-text-faint mb-1">
              實際起床
            </label>
            <input
              type="time"
              className="w-full bg-bg-surface border border-border-subtle rounded-lg p-2 text-white focus:border-primary focus:outline-none"
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
            className="flex items-center justify-center gap-2 bg-success-dark hover:bg-success py-4 rounded-xl font-bold transition-all active:scale-95"
          >
            <CheckCircle2 size={20} /> 結算：達標前進
          </button>
          <button
            onClick={() => handleDayComplete(false)}
            className="flex items-center justify-center gap-2 bg-bg-input hover:bg-bg-muted py-4 rounded-xl font-bold transition-all active:scale-95"
          >
            <XCircle size={20} /> 結算：失敗重試
          </button>
        </div>
      </div>

      <div className="mt-6 bg-primary-dark/40 border border-primary/30 rounded-xl p-4 flex items-start md:items-center gap-4">
        <div className="p-2 bg-primary/20 rounded-lg shrink-0">
          <Bell className="text-primary-light" size={24} />
        </div>
        <div>
          <div className="text-sm text-primary-subtle font-bold mb-1">
            今日睡前提醒
          </div>
          <div className="text-text-secondary text-sm">
            預計{" "}
            <span className="font-mono font-bold text-warning-subtle">
              {todayGoal.sleep}
            </span>{" "}
            就寢，請在{" "}
            <span className="font-mono font-bold text-warning-subtle">
              {blueLightCutoff}
            </span>{" "}
            啟動夜間模式。
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DayProgress;
