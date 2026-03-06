import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanStore } from "../store/usePlanStore";
import SetupForm from "../components/SetupForm";
import SleepGuide from "../components/SleepGuide";

const SetupPage = () => {
  const navigate = useNavigate();
  const sleepPlan = usePlanStore((s) => s.sleepPlan);

  // 若已有計畫，自動導向至 Dashboard
  useEffect(() => {
    if (sleepPlan) {
      navigate("/dashboard");
    }
  }, [sleepPlan, navigate]);

  if (sleepPlan) return null; // 避免跳轉前短暫閃爍

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SetupForm />
        <SleepGuide />
      </div>
    </div>
  );
};

export default SetupPage;
