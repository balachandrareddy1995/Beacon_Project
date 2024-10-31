// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  //test Timeout
   timeout: 300*1000, //1minitus(1 sec=1000msec)
  // @ts-ignore
  reporter: [
    ['html'],
    ['allure-playwright']
  ],
  use: {
  navigationTimeout:300*1000,
  actionTimeout:300*1000,
  browserName:'chromium',
  headless:false,
  screenshot:'on',
  video:'retain-on-failure',
  trace:'on',
  },

  expect: 
{
    timeout: 300*1000,
},

  
});

