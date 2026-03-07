import { create } from "zustand";
import {
  loadPlanData,
  savePlanData,
  clearPlanData,
} from "../utils/localStorageHandler";
import { generatePlan } from "../utils/planGenerator";
import { calculateDuration, addMinutes } from "../utils/timeUtils";

export const usePlanStore = create((set, get) => ({
  // --- State ---
  sleepPlan: null,
  currentDayIndex: 0,
  history: [],
  isFinished: false,
  inputs: {
    currentSleep: "06:00",
    currentWake: "15:00",
    targetSleep: "23:30",
    targetWake: "07:30",
    shiftPerDay: 15,
  },

  // --- Actions ---

  /** 更新表單輸入並持久化 */
  setInputs: (newInputs) => {
    const { sleepPlan, currentDayIndex, history, isFinished } = get();
    set({ inputs: newInputs });
    if (sleepPlan) {
      savePlanData({
        plan: sleepPlan,
        currentDayIndex,
        history,
        inputs: newInputs,
        isFinished,
      });
    }
  },

  /** 生成計畫、重置進度、持久化 */
  generatePlan: () => {
    const { inputs } = get();
    const newPlan = generatePlan(inputs);
    set({
      sleepPlan: newPlan,
      currentDayIndex: 0,
      history: [],
      isFinished: false,
    });
    savePlanData({
      plan: newPlan,
      currentDayIndex: 0,
      history: [],
      inputs,
      isFinished: false,
    });
  },

  /** 結算當天（接收 DayProgress 傳來的局部狀態） */
  completeDay: (success, actualSleep, actualWake) => {
    const {
      history,
      currentDayIndex,
      sleepPlan,
      inputs,
      isFinished: currentIsFinished,
    } = get();
    const record = { success, actualSleep, actualWake };

    let newHistory = [...history];
    let newSleepPlan = [...sleepPlan];
    let newDayIndex = currentDayIndex;
    let newIsFinished = currentIsFinished;

    if (!success) {
      // 失敗：累積歷史紀錄，並動態延長一天計畫（延續今天目標），推進到下一天
      newHistory.push(record);
      const currentDayPlan = sleepPlan[currentDayIndex];
      newSleepPlan.splice(currentDayIndex + 1, 0, { ...currentDayPlan });
      // 重新編號天數
      newSleepPlan = newSleepPlan.map((p, idx) => ({ ...p, day: idx + 1 }));
      newDayIndex = currentDayIndex + 1;
    } else {
      // 達標
      if (currentDayIndex < sleepPlan.length - 1) {
        newHistory.push(record);
        newDayIndex = currentDayIndex + 1;
      } else {
        // 最後一天達標：不再推進天數，標記為完成
        if (newHistory.length > currentDayIndex) {
          newHistory[currentDayIndex] = record;
        } else {
          newHistory.push(record);
        }
        newDayIndex = currentDayIndex;
        newIsFinished = true;
      }
    }

    // 計算並應用睡眠負債動態調整 (若還有下一天)
    if (!newIsFinished && newDayIndex < newSleepPlan.length) {
      const actualDuration = calculateDuration(actualSleep, actualWake);
      // 正常目標 7 小時 (420 分鐘)
      const debt = Math.max(0, 420 - actualDuration);
      if (debt > 0) {
        // 最多增加 120 分鐘補眠時間
        const compensation = Math.min(debt, 120);
        // 將增加的時間平分，分別提早入睡與延後起床
        const shiftMinutes = Math.floor(compensation / 2);
        if (shiftMinutes > 0) {
          newSleepPlan[newDayIndex] = {
            ...newSleepPlan[newDayIndex],
            sleep: addMinutes(newSleepPlan[newDayIndex].sleep, -shiftMinutes),
            wake: addMinutes(newSleepPlan[newDayIndex].wake, shiftMinutes),
          };
        }
      }
    }

    set({
      history: newHistory,
      currentDayIndex: newDayIndex,
      sleepPlan: newSleepPlan,
      isFinished: newIsFinished,
    });
    savePlanData({
      plan: newSleepPlan,
      currentDayIndex: newDayIndex,
      history: newHistory,
      inputs,
      isFinished: newIsFinished,
    });
  },

  /** 清除所有狀態與 localStorage */
  resetAll: () => {
    set({
      sleepPlan: null,
      currentDayIndex: 0,
      history: [],
      isFinished: false,
    });
    clearPlanData();
  },

  /** 從 localStorage 載入初始資料 */
  hydrate: () => {
    const saved = loadPlanData();
    if (saved) {
      set({
        sleepPlan: saved.plan,
        currentDayIndex: saved.currentDayIndex,
        history: saved.history,
        inputs: saved.inputs,
        isFinished: saved.isFinished || false,
      });
    }
  },
}));
