import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetupForm from "../components/SetupForm";
import SleepGuide from "../components/SleepGuide";

const SetupPage = ({ sleepPlan, inputs, onInputsChange, onGenerate }) => {
  const navigate = useNavigate();

  // 若已有計畫，自動導向至 Dashboard
  useEffect(() => {
    if (sleepPlan) {
      navigate("/dashboard");
    }
  }, [sleepPlan]);

  if (sleepPlan) return null; // 避免跳轉前短暫閃爍

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SetupForm
          inputs={inputs}
          onInputsChange={onInputsChange}
          onGenerate={onGenerate}
        />
        <SleepGuide />
      </div>
    </div>
  );
};

export default SetupPage;
