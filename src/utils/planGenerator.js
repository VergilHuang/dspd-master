/**
 * 睡眠調整計畫生成器
 */
import { timeToMinutes, minutesToTime, calculateDiff } from "./timeUtils";

/**
 * 根據輸入參數生成調整計畫
 * @param {object} inputs - { currentSleep, currentWake, targetSleep, targetWake, shiftPerDay }
 * @returns {Array<{day: number, sleep: string, wake: string}>}
 */
export const generatePlan = (inputs) => {
  const sleepDiff = calculateDiff(inputs.currentSleep, inputs.targetSleep);
  const wakeDiff = calculateDiff(inputs.currentWake, inputs.targetWake);

  const maxDiff = Math.max(Math.abs(sleepDiff), Math.abs(wakeDiff));
  const daysNeeded = Math.ceil(maxDiff / inputs.shiftPerDay);

  const plan = [];
  const startSleepMin = timeToMinutes(inputs.currentSleep);
  const startWakeMin = timeToMinutes(inputs.currentWake);

  for (let i = 0; i <= daysNeeded; i++) {
    const ratio = i / daysNeeded;
    plan.push({
      day: i + 1,
      sleep: minutesToTime(startSleepMin + sleepDiff * ratio),
      wake: minutesToTime(startWakeMin + wakeDiff * ratio),
    });
  }

  return plan;
};
