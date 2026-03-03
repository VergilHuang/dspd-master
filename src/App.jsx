import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { usePlanData } from "./hooks/usePlanData";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const planData = usePlanData();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <SetupPage
          sleepPlan={planData.sleepPlan}
          inputs={planData.inputs}
          onInputsChange={planData.handleInputsChange}
          onGenerate={planData.handleGeneratePlan}
        />
      ),
    },
    {
      path: "/dashboard",
      element: (
        <DashboardPage
          sleepPlan={planData.sleepPlan}
          currentDayIndex={planData.currentDayIndex}
          history={planData.history}
          actualSleep={planData.actualSleep}
          actualWake={planData.actualWake}
          inputs={planData.inputs}
          setActualSleep={planData.setActualSleep}
          setActualWake={planData.setActualWake}
          onDayComplete={planData.handleDayComplete}
          onResetAll={planData.handleResetAll}
        />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
