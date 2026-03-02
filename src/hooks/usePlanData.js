import { useState, useEffect, useCallback } from "react";
import {
  loadPlanData,
  savePlanData,
  clearPlanData,
} from "../utils/localStorageHandler";
import { generatePlan } from "../utils/planGenerator";

export const usePlanData = () => {
  // --- State ---
  const [sleepPlan, setSleepPlan] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [history, setHistory] = useState([]);

  // 今日實際作息輸入狀態
  const [actualSleep, setActualSleep] = useState("");
  const [actualWake, setActualWake] = useState("");

  // Setup Form State
  const [inputs, setInputs] = useState({
    currentSleep: "06:00",
    currentWake: "15:00",
    targetSleep: "23:30",
    targetWake: "07:30",
    shiftPerDay: 15,
  });

  // --- Persistence (localStorage) ---
  useEffect(() => {
    const saved = loadPlanData();
    if (saved) {
      setSleepPlan(saved.plan);
      setCurrentDayIndex(saved.currentDayIndex);
      setHistory(saved.history);
      setInputs(saved.inputs);
      if (saved.plan && saved.plan[saved.currentDayIndex]) {
        setActualSleep(saved.plan[saved.currentDayIndex].sleep);
        setActualWake(saved.plan[saved.currentDayIndex].wake);
      }
    }
  }, []);

  // --- Handlers ---
  const handleInputsChange = useCallback(
    (newInputs) => {
      setInputs(newInputs);
      if (sleepPlan) {
        savePlanData({
          plan: sleepPlan,
          currentDayIndex,
          history,
          inputs: newInputs,
        });
      }
    },
    [sleepPlan, currentDayIndex, history],
  );

  const handleGeneratePlan = useCallback(() => {
    const newPlan = generatePlan(inputs);
    setSleepPlan(newPlan);
    setCurrentDayIndex(0);
    setHistory([]);
    if (newPlan && newPlan[0]) {
      setActualSleep(newPlan[0].sleep);
      setActualWake(newPlan[0].wake);
    }
    savePlanData({ plan: newPlan, currentDayIndex: 0, history: [], inputs });
  }, [inputs]);

  const handleDayComplete = useCallback(
    (success) => {
      const record = { success, actualSleep, actualWake };
      const newHistory = [...history, record];
      const newDayIndex =
        success && currentDayIndex < sleepPlan.length - 1
          ? currentDayIndex + 1
          : currentDayIndex;

      if (newDayIndex !== currentDayIndex && sleepPlan[newDayIndex]) {
        setActualSleep(sleepPlan[newDayIndex].sleep);
        setActualWake(sleepPlan[newDayIndex].wake);
      }

      setHistory(newHistory);
      setCurrentDayIndex(newDayIndex);
      savePlanData({
        plan: sleepPlan,
        currentDayIndex: newDayIndex,
        history: newHistory,
        inputs,
      });
    },
    [history, actualSleep, actualWake, currentDayIndex, sleepPlan, inputs],
  );

  const handleResetAll = useCallback(() => {
    setSleepPlan(null);
    setCurrentDayIndex(0);
    setHistory([]);
    setActualSleep("");
    setActualWake("");
    clearPlanData();
  }, []);

  return {
    // State
    sleepPlan,
    currentDayIndex,
    history,
    actualSleep,
    actualWake,
    inputs,
    // Setters
    setActualSleep,
    setActualWake,
    // Handlers
    handleInputsChange,
    handleGeneratePlan,
    handleDayComplete,
    handleResetAll,
  };
};
