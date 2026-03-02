import { Brain, Clock, Activity, Thermometer } from "lucide-react";
import Card from "./Card";

const SleepGuide = () => (
  <Card className="bg-indigo-900/20 border-indigo-500/30 flex flex-col justify-center">
    <h2 className="flex items-center gap-2 text-xl text-indigo-300 font-bold mb-6">
      <Brain size={24} /> 睡眠品質指南與小知識
    </h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
          <Clock size={16} className="text-indigo-400" /> 建議睡眠時數 (依年齡)
        </h3>
        <ul className="text-sm text-slate-400 space-y-1 ml-6 list-disc">
          <li>
            <strong className="text-slate-300">14-17 歲：</strong> 8 到 10 小時
          </li>
          <li>
            <strong className="text-slate-300">18-64 歲 (成人)：</strong> 7 到 9
            小時
          </li>
          <li>
            <strong className="text-slate-300">65 歲以上：</strong> 7 到 8 小時
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
          <Activity size={16} className="text-indigo-400" /> 睡眠週期 (Sleep
          Cycle)
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
            <span className="text-amber-300 font-bold">REM (快速動眼期)：</span>{" "}
            大腦活躍，負責整理記憶與情緒。
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-slate-200 font-bold mb-2 flex items-center gap-2">
          <Thermometer size={16} className="text-indigo-400" /> 核心體溫與入睡
        </h3>
        <p className="text-sm text-slate-400">
          針對<strong>亞熱帶地區</strong>，建議將室溫設定在{" "}
          <strong>23°C - 26°C</strong>，並將相對濕度控制在{" "}
          <strong>50% - 60%</strong> 幫助核心體溫下降。
        </p>
      </div>
    </div>
  </Card>
);

export default SleepGuide;
