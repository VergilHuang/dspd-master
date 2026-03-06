import { Clock } from "lucide-react";
import { usePlanStore } from "../store/usePlanStore";
import Card from "./Card";

const SetupForm = () => {
  const inputs = usePlanStore((s) => s.inputs);
  const setInputs = usePlanStore((s) => s.setInputs);
  const generatePlan = usePlanStore((s) => s.generatePlan);

  const handleChange = (field, value) => {
    setInputs({ ...inputs, [field]: value });
  };

  return (
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
              onChange={(e) => handleChange("currentSleep", e.target.value)}
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
              onChange={(e) => handleChange("currentWake", e.target.value)}
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
              onChange={(e) => handleChange("targetSleep", e.target.value)}
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
              onChange={(e) => handleChange("targetWake", e.target.value)}
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
              handleChange("shiftPerDay", Number(e.target.value))
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
  );
};

export default SetupForm;
