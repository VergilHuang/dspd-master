// 自訂步驟定義
// 可在此擴充 I 物件的方法

module.exports = function () {
  return actor({
    // 自訂方法範例：
    // clearLocalStorageAndReload: async function () {
    //   this.executeScript(() => localStorage.clear());
    //   this.refreshPage();
    // },
  });
};
