const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");

// 在 CI 時自動 headless
setHeadlessWhen(process.env.CI);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: "./tests/*_test.cjs",
  output: "./output",
  helpers: {
    Playwright: {
      url: "http://localhost:5173",
      show: true,
      browser: "chromium",
      waitForAction: 200,
    },
  },
  include: {
    I: "./steps_file.cjs",
  },
  name: "dspd-master",
};
