import { AlertTriangle } from "lucide-react";

const ResetModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-warning-light">
          <AlertTriangle size={24} />
          <h3 className="text-lg font-bold">重新開始？</h3>
        </div>
        <p className="text-text-secondary mb-6">
          確定要刪除所有進度並重新設定計畫嗎？此動作無法復原。
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-bg-input hover:bg-bg-muted text-text-base transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-danger hover:bg-danger-light text-white font-bold transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;
