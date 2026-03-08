import { Trophy, Clock, CalendarCheck, RotateCcw, Star } from "lucide-react";
import { usePlanStore } from "../store/usePlanStore";
import { calculateDuration, formatDuration } from "../utils/timeUtils";
import Card from "./Card";

const SuccessScreen = () => {
  const history = usePlanStore((s) => s.history);
  const resetAll = usePlanStore((s) => s.resetAll);

  const totalDays = history.length;
  const totalSleepMins = history.reduce((acc, record) => {
    return acc + calculateDuration(record.actualSleep, record.actualWake);
  }, 0);
  const avgSleepMins = totalDays > 0 ? totalSleepMins / totalDays : 0;

  const successCount = history.filter((r) => r.success).length;
  const successRate = totalDays > 0 ? successCount / totalDays : 0;

  let feedback = "";
  if (successRate >= 0.9) {
    feedback = "完美達成！你的生理時鐘已經非常穩定，繼續保持這個好習慣。";
  } else if (successRate >= 0.7) {
    feedback = "表現優異！雖然偶有波動，但整體作息已經大幅改善。";
  } else {
    feedback = "辛苦了！調整作息是一條漫長的路，你已經跨出了最重要的一步。";
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8 p-8 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-achievement blur-3xl opacity-20 rounded-full animate-pulse"></div>
        <Trophy className="text-achievement relative z-10" size={80} />
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-achievement-light to-achievement-dark mb-2">
        恭喜成功達標！
      </h1>
      <p className="text-text-muted mb-8 max-w-md mx-auto">
        你已經完成了這次的睡眠調整計畫。來看看你這段時間的努力成果吧：
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        <div className="bg-bg-surface/50 border border-border rounded-2xl p-6 flex flex-col items-center">
          <CalendarCheck className="text-primary-light mb-3" size={32} />
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {totalDays}{" "}
            <span className="text-sm text-text-faint font-sans">天</span>
          </div>
          <div className="text-sm text-text-muted">總進行天數</div>
        </div>

        <div className="bg-bg-surface/50 border border-border rounded-2xl p-6 flex flex-col items-center">
          <Clock className="text-success-light mb-3" size={32} />
          <div className="text-3xl font-mono font-bold text-white mb-1">
            {formatDuration(avgSleepMins)}
          </div>
          <div className="text-sm text-text-muted">平均每日睡眠時數</div>
        </div>
      </div>

      <div className="w-full bg-bg-surface/80 rounded-2xl p-6 mb-8 border border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Star size={100} />
        </div>
        <h3 className="text-lg font-bold text-text-secondary flex items-center gap-2 mb-2 relative z-10">
          <Star className="text-achievement" size={20} /> AI 睡眠品質評估
        </h3>
        <p className="text-text-secondary text-left leading-relaxed relative z-10">
          {feedback}
        </p>
      </div>

      <button
        onClick={() => resetAll()}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary-dark hover:bg-primary text-white font-bold py-4 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary-dark/20"
      >
        <RotateCcw size={20} /> 重新設定全新計畫
      </button>
    </Card>
  );
};

export default SuccessScreen;
