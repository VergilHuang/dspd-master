import { X, AlertCircle } from "lucide-react";

const SleepWarningDialog = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-bg-surface border border-border rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden my-8 relative">
        <div className="p-6 border-b border-border flex justify-between items-center bg-bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-3 text-warning-light">
            <AlertCircle size={24} />
            <h3 className="text-xl font-bold">熬夜與睡眠不足的健康影響</h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 text-text-secondary space-y-4 max-h-[60vh] overflow-y-auto">
          <p className="font-semibold text-text-base">
            根據最新醫學研究，長期缺乏睡眠或作息不規律（如 DSPD
            導致的睡眠不足）會對身體造成全身性的影響：
          </p>

          <ul className="space-y-4 mt-4">
            <li>
              <h4 className="font-bold text-danger-light">
                🧠 腦部與認知功能受損
              </h4>
              <p className="text-sm mt-1">
                睡眠不足會影響大腦清除澱粉樣蛋白，增加失智症風險；同時也會導致注意力不集中、記憶力衰退及情緒不穩。
              </p>
            </li>
            <li>
              <h4 className="font-bold text-warning">🫀 心血管疾病風險大增</h4>
              <p className="text-sm mt-1">
                長期熬夜易引起交感神經亢奮，導致血壓升高，並顯著增加心肌梗塞、中風等心腦血管疾病發生率。
              </p>
            </li>
            <li>
              <h4 className="font-bold text-warning-light">
                📉 代謝異常與體重增加
              </h4>
              <p className="text-sm mt-1">
                睡眠不足會降低胰島素敏感性，增加第 2
                型糖尿病風險；同時也會改變食慾荷爾蒙（如瘦素降低、飢餓素增加），更容易導致肥胖。
              </p>
            </li>
            <li>
              <h4 className="font-bold text-success-light">
                🛡️ 免疫力全面下降
              </h4>
              <p className="text-sm mt-1">
                睡眠減少會影響免疫系統產生抗體與細胞激素，使感染呼吸道疾病（如感冒、流感）的機率增加
                2-3 倍。
              </p>
            </li>
            <li>
              <h4 className="font-bold text-primary-light">🧬 內分泌失調</h4>
              <p className="text-sm mt-1">
                擾亂皮質醇（壓力荷爾蒙）和褪黑激素的正常分泌節律，不僅影響睡眠品質，也對生殖系統及甲狀腺功能產生負面影響。
              </p>
            </li>
          </ul>
        </div>

        <div className="p-4 border-t border-border bg-bg-surface/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-bg-input hover:bg-bg-muted text-white rounded-lg transition-colors font-medium"
          >
            我了解了
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepWarningDialog;
