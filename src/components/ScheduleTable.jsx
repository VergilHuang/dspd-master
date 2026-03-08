import { CheckCircle2, XCircle } from "lucide-react";
import Card from "./Card";

const ScheduleTable = ({ plan, history, currentDayIndex }) => (
  <Card className="overflow-hidden p-0">
    <div className="p-6 border-b border-border">
      <h2 className="text-lg font-bold">完整調整時程與實際紀錄表</h2>
    </div>
    <div className="max-h-80 overflow-y-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-bg-base/50 sticky top-0 z-10">
          <tr>
            <th className="p-4">天數</th>
            <th className="p-4 text-primary-subtle">目標 (睡/醒)</th>
            <th className="p-4 text-warning-subtle">實際 (睡/醒)</th>
            <th className="p-4">狀態</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {plan.map((d, idx) => {
            const isPast = idx < history.length;
            const isCurrent = idx === currentDayIndex;
            const record = history[idx];

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
                className={`${isCurrent ? "bg-primary/10" : ""} ${isPast ? "opacity-80" : ""}`}
              >
                <td className="p-4 font-mono">Day {d.day}</td>
                <td className="p-4 font-mono text-text-secondary">
                  {d.sleep} - {d.wake}
                </td>
                <td className="p-4 font-mono text-text-secondary">
                  {isPast ? `${actSleep} - ${actWake}` : "-"}
                </td>
                <td className="p-4">
                  {isPast ? (
                    isSuccess ? (
                      <span className="text-success-light flex items-center gap-1">
                        <CheckCircle2 size={14} /> 達標
                      </span>
                    ) : (
                      <span className="text-danger-subtle flex items-center gap-1">
                        <XCircle size={14} /> 失敗
                      </span>
                    )
                  ) : isCurrent ? (
                    <span className="text-primary-light font-bold">進行中</span>
                  ) : (
                    <span className="text-text-disabled">待執行</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </Card>
);

export default ScheduleTable;
