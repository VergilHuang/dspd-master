/**
 * 時間計算工具函式
 */

export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (totalMinutes) => {
  const roundedMinutes = Math.round(totalMinutes);
  const normalized = (roundedMinutes + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const calculateDiff = (current, target) => {
  let diff = timeToMinutes(target) - timeToMinutes(current);
  if (diff > 720) diff -= 1440;
  if (diff < -720) diff += 1440;
  return diff;
};

export const addMinutes = (timeStr, mins) => {
  const m = timeToMinutes(timeStr) + mins;
  return minutesToTime(m);
};

// 計算兩個時間點之間的持續時間(分鐘)，考量跨日
export const calculateDuration = (sleepTime, wakeTime) => {
  let sleepMins = timeToMinutes(sleepTime);
  let wakeMins = timeToMinutes(wakeTime);
  if (wakeMins < sleepMins) {
    wakeMins += 1440; // 跨夜
  }
  return wakeMins - sleepMins;
};

// 格式化分鐘為小時與分鐘
export const formatDuration = (mins) => {
  if (isNaN(mins)) return "0h 0m";
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${h}h ${m}m`;
};
