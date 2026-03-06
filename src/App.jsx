import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { usePlanStore } from "./store/usePlanStore";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/DashboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SetupPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

const App = () => {
  const hydrate = usePlanStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <RouterProvider router={router} />;
};

export default App;
