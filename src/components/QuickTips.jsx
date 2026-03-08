import { Info } from "lucide-react";
import Card from "./Card";

const QuickTips = () => (
  <Card className="bg-primary-dark/20 border-primary/30 h-full">
    <h3 className="flex items-center gap-2 text-primary-subtle font-bold mb-4">
      <Info size={18} /> 調整提醒
    </h3>
    <ul className="text-sm space-y-4 text-text-secondary">
      <li className="flex gap-2">
        <span className="text-primary-light font-bold">1.</span>
        <span>醒來後 10 分鐘內，接收陽光 15-30 分鐘重設生理時鐘。</span>
      </li>
      <li className="flex gap-2">
        <span className="text-primary-light font-bold">2.</span>
        <span>
          若下午極度疲倦，可嚴格限制小睡15~20分鐘，若超過30分鐘會嚴重影響睡眠慣性(Sleep
          Inertia)，且會消耗掉晚間入睡所需的睡眠壓力(Sleep Pressure)。
        </span>
      </li>
    </ul>
  </Card>
);

export default QuickTips;
