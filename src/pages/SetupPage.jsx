import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlanStore } from "../store/usePlanStore";
import SetupForm from "../components/SetupForm";
import SleepGuide from "../components/SleepGuide";

const SetupPage = () => {
  const navigate = useNavigate();
  const sleepPlan = usePlanStore((s) => s.sleepPlan);

  useEffect(() => {
    if (sleepPlan) {
      navigate("/dashboard");
    }
  }, [sleepPlan, navigate]);

  if (sleepPlan) return null;

  return (
    <div className="min-h-screen bg-bg-base text-text-base p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SetupForm />
        <SleepGuide />
      </div>
    </div>
  );
};

export default SetupPage;
