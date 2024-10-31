const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../POM/LoginPage');
const { DasBoardPage } = require('../POM/DashBoardPage');
const { BannedCustomerPage } = require('../POM/BannedCustomerPage');
const environments = require('../.env/environments');
const ExcelReader = require('../Utility/ExcelReader');
const {RoleManagementPage}=require('../POM/RoleManagementPage');



test.describe.configure({ mode: 'serial' });


test.describe.only('Role Management Creation', () => {
  let browser;
  let context;
  let page;
  let loginPage;
  let dashBoardPage;
  let bannedCustomerPage;
  let config;
  let excelReader;
  let roleManagement;
 
  

 
  test.beforeAll(async ({ browser: b }) => {
    
    const environment = process.env.TEST_ENV || 'QAEnv';
    config = environments[environment];
    
    browser = b;
    context = await browser.newContext();
    page = await context.newPage();


    // Instantiate page objects
    loginPage = new LoginPage(page);
    dashBoardPage = new DasBoardPage(page);
    bannedCustomerPage = new BannedCustomerPage(page);
    excelReader=new ExcelReader(page)
    roleManagement=new RoleManagementPage(page);


    await loginPage.openUrl(config['baseUrl']);
    await page.waitForLoadState('networkidle');
    await loginPage.login(config['username'], config['password']);
    await page.waitForTimeout(5e3);
    await loginPage.yesButton();
    await page.waitForTimeout(5e3);
    await loginPage.reEnterLogin(config['username'], config['password']);

  });

  test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status === 'failed') {
      // Close the browser immediately if the test fails
      await browser.close();
      }
  });

  test.afterAll(async () => {
    await context.close();
  });


  // test.beforeEach(async()=>{
  //   await loginPage.openUrl(config['baseUrl']);
  //   await page.waitForLoadState('networkidle');
  //   await loginPage.login(config['username'], config['password']);
  //   await page.waitForTimeout(5e3);
  //   await loginPage.yesButton();
  //   await page.waitForTimeout(5e3);
  //   await loginPage.reEnterLogin(config['username'], config['password']);
   
  // })
test('Basic Login and Navigation to Role Management', async () => {

    await excelReader.readData("TestData/TestDataBeaconProject.xlsx","RoleManagementSheet", "Basic Login and Navigation to Role Management", " ");
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForLoadState('load');
    await roleManagement.verifyRoleManagementPageElements();
    
        });


test('Create a new role through role management', async () => {
            await excelReader.readData("TestData/TestDataBeaconProject.xlsx", "RoleManagementSheet", "Create a new role through role management", " ");
            await dashBoardPage.navigateToRoleManagement();
            await page.waitForTimeout(30e3);
            await roleManagement.clickAddNewRole();
            await page.waitForTimeout(20e3);
            const testData = await excelReader.readData("TestData/TestDataBeaconProject.xlsx", "RoleManagementSheet", "Create a new role through role management", "RoleName");
             const roleName=testData[0];
        if(roleName){
            await roleManagement.enterRoleName(roleName);
        }
        else {
            console.error('Not Reading the test data from Role Managament Sheet');
        }
        await page.waitForTimeout(12e3);
        await roleManagement.SelectFunctionalitiesCheckBox();
        await roleManagement.clickSave();
        await roleManagement.getSuccessMessage("Record Saved Successfully");
        await page.waitForTimeout(30e3);
        const testData1 = await excelReader.readData("TestData/TestDataBeaconProject.xlsx", "RoleManagementSheet", "Create a new role through role management", "RoleName");
        const roleName1=testData1[0];
         if(roleName1){
        await roleManagement.isRoleDisplayed(roleName1);
         }
         else {
          console.error('Not Reading the test data from Role Managament Sheet');
      }
       await roleManagement.isGreenTickPresent();


    });
    test('Verify Role Search Functionality',async()=>{
      const testData = await excelReader.readData("TestData/TestDataBeaconProject.xlsx", "RoleManagementSheet", "Create a new role through role management", "RoleName");
      const roleName=testData[0];
      await roleManagement.enterRoleNameInSearchField(roleName);
      await roleManagement.checkIsActiveCheckbox();
      await roleManagement.clickSearchButton();
      const testData1 = await excelReader.readData("TestData/TestDataBeaconProject.xlsx", "RoleManagementSheet", "Create a new role through role management", "RoleName");
      const roleName1=testData1[0];
      if(roleName1){
      await roleManagement.isRolePresentWithStatus(roleName1)
      }
      else{
        console.error('Not Reading the test data from Role Managament Sheet');
      }
      
      
    });

  
    
      
  



























});