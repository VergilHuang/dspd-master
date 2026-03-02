/**
 * localStorage 統一管理工具
 */

const STORAGE_KEY = "dspd_plan_data_v2";

/**
 * 從 localStorage 載入計畫資料
 * @returns {object|null} 已解析的資料物件，若無資料或解析失敗則回傳 null
 */
export const loadPlanData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error("[localStorageHandler] Failed to load data:", error);
    return null;
  }
};

/**
 * 將計畫資料儲存到 localStorage
 * @param {object} data - 包含 plan, currentDayIndex, history, inputs 的物件
 */
export const savePlanData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[localStorageHandler] Failed to save data:", error);
  }
};

/**
 * 清除 localStorage 中的計畫資料
 */
export const clearPlanData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("[localStorageHandler] Failed to clear data:", error);
  }
};
