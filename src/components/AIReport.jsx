import { FileText, CheckCircle2, ClipboardCopy } from "lucide-react";
import Card from "./Card";

const AIReport = ({ reportContent, onCopy, copied }) => (
  <Card className="bg-bg-base border-border">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <FileText className="text-primary-light" />
        AI 睡眠狀態評估報告
      </h2>
      <button
        onClick={onCopy}
        className="flex items-center gap-2 bg-primary-dark hover:bg-primary px-4 py-2 rounded-lg text-sm font-bold transition-colors"
      >
        {copied ? <CheckCircle2 size={16} /> : <ClipboardCopy size={16} />}
        {copied ? "已複製到剪貼簿" : "複製格式化報告"}
      </button>
    </div>
    <p className="text-sm text-text-muted mb-4">
      將此格式化報告複製並貼給 AI（如 ChatGPT /
      Claude），要求其根據紀錄評估你的「睡眠效率」並給予下一步的作息調整建議。
    </p>
    <div className="bg-bg-surface p-4 rounded-xl border border-border">
      <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed">
        {reportContent}
      </pre>
    </div>
  </Card>
);

export default AIReport;
