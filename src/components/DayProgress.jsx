import { Moon, Sun, CheckCircle2, XCircle, Bell } from "lucide-react";
import Card from "./Card";

const DayProgress = ({
  todayGoal,
  actualSleep,
  actualWake,
  onActualSleepChange,
  onActualWakeChange,
  onDayComplete,
  blueLightCutoff,
}) => (
  <Card className="md:col-span-2 flex flex-col justify-between">
    <div>
      <h2 className="text-lg text-slate-400 mb-4 font-medium uppercase tracking-wider">
        今日作息目標
      </h2>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="text-center p-4 bg-slate-900/50 rounded-xl">
          <Moon className="mx-auto mb-2 text-indigo-300" size={32} />
          <div className="text-3xl font-mono font-bold">{todayGoal.sleep}</div>
          <div className="text-xs text-slate-500 mt-1">目標上床</div>
        </div>
        <div className="text-center p-4 bg-slate-900/50 rounded-xl">
          <Sun className="mx-auto mb-2 text-amber-300" size={32} />
          <div className="text-3xl font-mono font-bold">{todayGoal.wake}</div>
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
          <label className="block text-xs text-slate-500 mb-1">實際入睡</label>
          <input
            type="time"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
            value={actualSleep}
            onChange={(e) => onActualSleepChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">實際起床</label>
          <input
            type="time"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:border-indigo-500 focus:outline-none"
            value={actualWake}
            onChange={(e) => onActualWakeChange(e.target.value)}
          />
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onDayComplete(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold transition-all active:scale-95"
        >
          <CheckCircle2 size={20} /> 結算：達標前進
        </button>
        <button
          onClick={() => onDayComplete(false)}
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
);

export default DayProgress;
