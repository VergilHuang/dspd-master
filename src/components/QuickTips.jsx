import { Info } from "lucide-react";
import Card from "./Card";

const QuickTips = () => (
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
);

export default QuickTips;
