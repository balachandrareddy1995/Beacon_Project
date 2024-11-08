const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../POM/LoginPage");
const { DasBoardPage } = require("../POM/DashBoardPage");
const { BannedCustomerPage } = require("../POM/BannedCustomerPage");
const environments = require("../.env/environments");
const ExcelReader = require("../Utility/ExcelReader");
const { RoleManagementPage } = require("../POM/RoleManagementPage");

test.describe.configure({ mode: "serial" });

test.describe.only("Role Management Creation", () => {
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
    const environment = process.env.TEST_ENV || "QAEnv";
    config = environments[environment];

    browser = b;
    context = await browser.newContext();
    page = await context.newPage();

    // Instantiate page objects
    loginPage = new LoginPage(page);
    dashBoardPage = new DasBoardPage(page);
    bannedCustomerPage = new BannedCustomerPage(page);
    excelReader = new ExcelReader(page);
    roleManagement = new RoleManagementPage(page);

    await loginPage.openUrl(config["baseUrl"]);
    await page.waitForLoadState("domcontentloaded");
    await loginPage.login(config["username"], config["password"]);
    await page.waitForTimeout(5e3);
    await loginPage.yesButton();
    await page.waitForTimeout(5e3);
    await loginPage.reEnterLogin(config["username"], config["password"]);
    await page.waitForLoadState('load');
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status === "failed") {
      // Close the browser immediately if the test fails
      await browser.close();
    }
  });

  test.afterAll(async () => {
    await context.close();
  });

  test("Basic Login and Navigation to Role Management", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Basic Login and Navigation to Role Management",
      " RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(10e3);
    await roleManagement.verifyRoleManagementPageElements();
  });

  test("Create a new role through role management", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForTimeout(5e3);
    await roleManagement.clickAddNewRole();
    await page.waitForTimeout(20e3);
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName = testData[0];
    if (roleName) {
      await roleManagement.enterRoleName(roleName);
    } else {
      console.error("Not Reading the test data from Role Managament Sheet");
    }
    await page.waitForTimeout(12e3);
    await roleManagement.SelectFunctionalitiesCheckBox();
    await roleManagement.clickSave();
    await roleManagement.getSuccessMessage("Record Saved Successfully");
    await page.waitForTimeout(30e3);
    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName1 = testData1[0];
    if (roleName1) {
      await roleManagement.isRoleDisplayed(roleName1);
    } else {
      console.error("Not Reading the test data from Role Managament Sheet");
    }
    await roleManagement.roleNameStatusIsactive();
  });
  test("Verify Role Search Functionality", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Search Functionality",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForTimeout(30e3);
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName = testData[0];
    await roleManagement.enterRoleNameInSearchField(roleName);
    await roleManagement.checkIsActiveCheckbox();
    await roleManagement.clickSearchButton();
    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName1 = testData1[0];
    if (roleName1) {
      await roleManagement.isRolePresentWithStatus(roleName1);
    } else {
      console.error("Not Reading the test data from Role Managament Sheet");
    }
  });
  test("Verify Role Deactivation", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Deactivation",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForTimeout(30e3);
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName = testData[0];
    await roleManagement.enterRoleNameInSearchField(roleName);
    await page.waitForTimeout(5e3);
    await roleManagement.clickSearchButton();
    await page.waitForTimeout(5e3);
    await roleManagement.threeDotsFromActionField();
    await page.waitForTimeout(5e3);
    await roleManagement.activeAndDeactiveButton();
    await page.waitForTimeout(3e3);
    await roleManagement.verifySuccessMessage("Role De-activated Successfully");
    await page.waitForTimeout(3e3);
  }); //done
  test("Verify Role Search - Inactive", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Search - Inactive",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForTimeout(30e3);
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName = testData[0];
    await roleManagement.enterRoleNameInSearchField(roleName);
    await page.waitForTimeout(5e3);
    await roleManagement.unCheckCheckBox();
    await page.waitForTimeout(5e3);
    await roleManagement.clickSearchButton();
    await page.waitForTimeout(30e3);
    await roleManagement.roleNameStatusIsInactive();
  }); //done
  test("Verify Role Activation", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Activation",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForTimeout(30e3);
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName = testData[0];
    await roleManagement.enterRoleNameInSearchField(roleName);
    await page.waitForTimeout(15e3);
    await roleManagement.checktheCheckBox();
    await roleManagement.threeDotsFromActionField();
    await page.waitForTimeout(5e3);
    await roleManagement.activeAndDeactiveButton();
    await page.waitForTimeout(2e3);
    await roleManagement.verifyRoleActivation("Role Activated Successfully.");
  });

  test("Verify Pagination", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Pagination",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("load");
    await roleManagement.getRolesCount(10);
  });
  test("Verify Role Visibility in Role Management", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Visibility in Role Management",
      "RoleName"
    );
    await dashBoardPage.navigateToUserManagement();
    await page.waitForLoadState("domcontentloaded");
    await roleManagement.clickAddUserButton();
    const readRoleName = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    await roleManagement.searchForRoleAddNewUser(readRoleName[0]);
  });
  test("Verify Role Visibility in add new user page inside Role Management page", async () => {
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Visibility in add new user page inside Role Management page",
      "RoleName"
    );
    await dashBoardPage.navigateToUserManagement();
    await page.waitForTimeout(10e3);
    const readRoleName = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    await roleManagement.searchRoleUsermanagementpage(readRoleName[0]);
  });
  //08:42Pm-11:38Pm(11-07-2024)
  test('Verify Role Edit Functionality',async()=>{
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Edit Functionality",
      "RoleName"
    );

    await dashBoardPage.navigateToRoleManagement();
    await page.waitForLoadState('domcontentloaded');
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Create a new role through role management",
      "RoleName"
    );
    const roleName = testData[0];
    await roleManagement.enterRoleNameInSearchField(roleName);
    await page.waitForTimeout(5e3);
    await roleManagement.clickSearchButton();
    await page.waitForLoadState('load');
    await page.waitForTimeout(50e3);
    await roleManagement.threeDotsFromActionField();
    await page.waitForTimeout(5e3);
    await roleManagement.editRole();
    await roleManagement.changeRoleSettings();
    await roleManagement.clickSave();
    await roleManagement.recordUpdatedSuccessfully("Record Updated Successfully");

  });//9:09(8-11-2024)
  test('Verify Role Edit changes reflected in TestRole',async()=>{
    await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "RoleManagementSheet",
      "Verify Role Edit changes reflected in TestRole",
      "RoleName"
    );
    await dashBoardPage.navigateToRoleManagement();
    await page.waitForLoadState('domcontentloaded');

  });


});
