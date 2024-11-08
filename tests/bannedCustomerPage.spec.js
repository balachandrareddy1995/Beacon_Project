const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../POM/LoginPage");
const { DasBoardPage } = require("../POM/DashBoardPage");
const { BannedCustomerPage } = require("../POM/BannedCustomerPage");
const environments = require("../.env/environments");
const ExcelReader = require("../Utility/ExcelReader");

test.describe.configure({ mode: "serial" });

test.describe("Banned Customer Creation", () => {
  let browser;
  let context;
  let page;
  let loginPage;
  let dashBoardPage;
  let bannedCustomerPage;
  let config;
  let excelReader;

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
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status === "failed") {
      // Close the browser immediately if the test fails
      await browser.close();
    }
  });

  // test.afterAll(async () => {
  //   if (context) {
  //     await context.close();
  //   }
  // });

  test.afterAll(async () => {
    await context.close();
  });

  test("As a User Login to the Application and Click on the Banned Custmore Link", async () => {
    await loginPage.openUrl(config["baseUrl"]);
    await page.waitForLoadState("networkidle");
    await loginPage.login(config["username"], config["password"]);
    await page.waitForTimeout(5e3);
    await loginPage.yesButton();
    await page.waitForTimeout(5e3);
    await loginPage.reEnterLogin(config["username"], config["password"]);
    // await page.waitForLoadState('load');
    await dashBoardPage.navigateToBannedCustomer();
  });

  test("verify All the objects in a Banned Custmore Page", async () => {
    await bannedCustomerPage.verifyBannedCustomerPageElements();
  });

  test("As a User to Validate the ID Proof Document in ID Proof Document dropdown from a BannedCustome Pag", async () => {
    await dashBoardPage.verifyIDProofDocumentTypesInSideDropdown();
  });
  test("Verify Warning Message CustmoreName After clicking on the Search Button", async () => {
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(2e3);
    await bannedCustomerPage.verifyWarningMessageCustmoreName();
    await page.waitForTimeout(1e3);
  });
  test("AS a User To Enter the name in the CustomerName field.", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Customer Name Field - ECP Validations(Positive)",
      "CustomerName"
    );
    const customerName = testData[0];
    console.log(customerName);

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }
  });
  test("AS a User To Enter the name in the CustomerName field More then 50 character it should allowed only 0-50", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Customer Name Field - ECP Validations(Min&Max)",
      "CustomerName"
    );
    const customerName = testData[0];
    console.log(customerName);
    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }
  });

  test("As a User to Enter the Valid Customer Name in the CustomerName field", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustmoreSheet",
      "Customer Name Field - ECP Validations(Positive)",
      "CustomerName"
    );
    const customerName = testData[0];

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }
  });
  test("Verify Warning Message SelectIdProofDocument after clicking the SearchButton", async () => {
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(1e3);
    await bannedCustomerPage.verifyWarningMessageselectIDProofDocument();
    await page.waitForTimeout(1e3);
  });

  test("As a User Choose the Select Id Proof Document All", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Banned Customer Page-Form",
      "IDProofDocument"
    );

    if (testData.length > 0) {
      for (const IdProofDocument of testData) {
        console.log("Id ProofDocument Dropdown values :" + IdProofDocument); // Print each ID proof document
        await bannedCustomerPage.selectIdProofDocument(IdProofDocument);
        await page.waitForTimeout(1000);
      }
    } else {
      console.error("No valid test data found for ID Proof Document.");
    }
  });

  test("Verify Warning Message Id Proof Number after clicking the Search Button", async () => {
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(3e3);
    await bannedCustomerPage.verifyWarningMessageIdProofNumber();
    await page.waitForTimeout(5000);
  });
  test("As a User to Enter the Id ProofNo in the Id proofNo field is allowing 0 to 20", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Banned Customer Page-Form",
      "IDProofNumber"
    );

    if (testData.length > 0) {
      for (const IDProofNoField of testData) {
        console.log("IDProofNo Reading:" + IDProofNoField);
        await bannedCustomerPage.enterIdProofNo(IDProofNoField);
        await page.waitForTimeout(3000);
      }
    } else {
      console.error("No valid test data found for IDProofNo field.");
    }
  });
  test("As a user click on the Reset Buttton after should remove the input values in the input fields in the Banned customer Page", async () => {
    await bannedCustomerPage.clickonResetButton();
    await page.waitForTimeout(3e3);
    await bannedCustomerPage.validationInputFieldsAfterReset();
    await page.waitForTimeout(3e3);
  });
  test("As a User to verify the No records found after click on the Search Button.", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Customer Name Field - ECP Validations(Positive)",
      "CustomerName"
    );
    const customerName = testData[0];

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Banned Customer Page-Form",
      "IDProofDocument"
    );

    if (testData1.length > 0) {
      for (const IdProofDocument of testData1) {
        console.log("Id ProofDocument Dropdown values :" + IdProofDocument); // Print each ID proof document
        await bannedCustomerPage.selectIdProofDocument(IdProofDocument);
        await page.waitForTimeout(1000);
      }
    } else {
      console.error("No valid test data found for ID Proof Document.");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Banned Customer Page-Form",
      "IDProofNumber"
    );

    if (testData2.length > 0) {
      for (const IDProofNoField of testData2) {
        console.log("IDProofNo Reading:" + IDProofNoField);
        await bannedCustomerPage.enterIdProofNo(IDProofNoField);
        await page.waitForTimeout(3000);
      }
    } else {
      console.error("No valid test data found for IDProofNo field.");
    }
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(5000);
    await bannedCustomerPage.noRecordsFound();
    await page.waitForTimeout(5e3);
    await bannedCustomerPage.clickonResetButton();
    await page.waitForTimeout(3e3);
  });
  test("Entere the Special Character from the Customer Name field and click on Search Button to Verify the Warning Message.", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Banned Customer Page-Error Guessing - SpecialChar",
      "CustomerName"
    );
    const customerName = testData[0];
    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }
  });

  test("Entere the Special Character from the IdProof Number field and click on Search Button to Verify the Warning Message.", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Banned Customer Page-Error Guessing - SpecialChar",
      "IDProofNumber"
    );
    const IDProofNofield = testData[0];
    if (IDProofNofield) {
      await bannedCustomerPage.enterIdProofNo(IDProofNofield);
    } else {
      console.error("No valid test data found for ID Proof No field.");
    }
  });
  test("verify the Warning Message,When Enter the Special char from CustomerName and IdProof Number", async () => {
    await bannedCustomerPage.clickSearchButton();
    await bannedCustomerPage.verifyWMessageCNameandIDPNumberSpecialCharacter();
  });

  test("When click on the Close Button to redirect into the Home page to Verify the any object from Home Page,", async () => {
    await bannedCustomerPage.closeButtonBottom();
    await page.waitForLoadState("load");
    await page.waitForLoadState("domcontentloaded");
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "HomePageUrl",
      "VerifyHomePageURL"
    );
    const homePageURl = testData[0];
    if (homePageURl) {
      await dashBoardPage.verifyHomePageUrlAfterCloseButton(homePageURl);
    } else {
      console.error("Home Page URL is not Verifyed");
    }

    await page.waitForTimeout(5e3);
    await dashBoardPage.verifyAnyOneOFTheElementInHomepage();
    await page.waitForTimeout(5e3);
  });
  test("As a User to Click on the Banned Customre Link Page ", async () => {
    await dashBoardPage.navigateToBannedCustomer();
    await page.waitForLoadState("load");
  });
  test("As a User to click on the Add New Cusrtmore Button to navigate to the AddBannedCustomer Page", async () => {
    await dashBoardPage.navigateToAddNewCustomerPage();
    await page.waitForLoadState("load");
  });
  test("Verify the all the objects in a AddBannedCustomer page", async () => {
    await bannedCustomerPage.verifyAddNewCustomerPageDisplayed();
    await page.waitForTimeout(3e3);
  });
  test("Enter Valid Input into all the fields in a AddBannedCustomer Page", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "Customer ID"
    );
    const customerId = testData[0];
    if (customerId) {
      console.log("customerId:" + customerId);
      await bannedCustomerPage.enterCustomerID(customerId);
    } else {
      console.error("Customer Id is not Entered.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "CustomerName"
    );
    const customerName = testData1[0];
    console.log("customerName:" + customerName);
    if (customerName) {
      await bannedCustomerPage.addBandCustmoreCustmoreName(customerName);
    } else {
      console.error("Customer Name is Not Entered");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "MobileNumber"
    );
    const mobilNumber = testData2[0];
    if (mobilNumber) {
      const mNumber = mobilNumber.toString();
      console.log("Reading MobilNumber :" + mNumber);
      await bannedCustomerPage.enterMobileNumber(mNumber);
    } else {
      console.error("Mobile Number is Not Entered");
    }

    const testData3 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "Address"
    );
    const address = testData3[0];

    if (address) {
      console.log("Address :" + address);
      await bannedCustomerPage.enterAddressInput(address);
    } else {
      console.log("Address is Not Entered");
    }

    const testData4 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "IDProofDocument"
    );
    const document = testData4[0];

    if (document) {
      console.log("IdProof Document :" + document);
      await bannedCustomerPage.selectIdProofDocument(document);
    } else {
      console.log("IDProof Document is not Selected");
    }

    const testData5 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "IDProofNumber"
    );
    const IDProofNumber = testData5[0];
    if (IDProofNumber) {
      await bannedCustomerPage.addBandCustmoreIdProofNumber(IDProofNumber);
    } else {
      console.log("IDProofNumber is Not Entered");
    }
  });
  test("Click on Reset Button after to remove all the input values from the fields to verify the input values should  be removed", async () => {
    await bannedCustomerPage.clickonResetButton();
    await page.waitForTimeout(5e3);
    await bannedCustomerPage.verifyAllInputValuesAddBanneCustmorePageAfterReset();
  });
  test("As a user to click on the Save Button,should show the Warning Message for Custmore Name field without input data", async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await page.waitForTimeout(2e3);
    await bannedCustomerPage.addBannedCustmorePageCustmoreNameWarning();
  });
  test("As a User to Enter the Valid Custmore name in the CustmoreName field in Add BandCustmore Page", async () => {
    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "CustomerName"
    );
    const customerName = testData1[0];
    console.log("customerName:" + customerName);
    if (customerName) {
      await bannedCustomerPage.addBandCustmoreCustmoreName(customerName);
    } else {
      console.error("Customer Name is Not Entered");
    }
  });
  test("As a User to click on the Search button,Should verify the Warning Message for Mobile Number without input data from Add bBanned custmore Page ", async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await page.waitForTimeout(2e3);
    await bannedCustomerPage.verifyWarningMessageMobilNumber();
  });
  test("As a User to Enter the MobileNumber from Add BandCustmore Page ", async () => {
    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "MobileNumber"
    );
    const mobilNumber = testData2[0];
    if (mobilNumber) {
      const mNumber = mobilNumber.toString();
      console.log("Reading MobilNumber :" + mNumber);
      await bannedCustomerPage.enterMobileNumber(mNumber);
    } else {
      console.error("Mobile Number is Not Entered");
    }
  });

  test("verify the Warning Messagae without enter the testdata from Address field.When Click on Save Button.", async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.verifyWarningMessageAddress();
  });
  test("As a User to Enter the Address From Address Field from AddBannedCustomer Page", async () => {
    const testData3 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "Address"
    );
    const address = testData3[0];

    if (address) {
      console.log("Address :" + address);
      await bannedCustomerPage.enterAddressInput(address);
    } else {
      console.logy("Address is Not Entered");
    }
  });
  test("verify the Warning Message ID Proof Document without choosing the document,When click on the save button from AddBannedCustomer Page", async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.verifyWarningMessageselectIDProofDocument();
    await page.waitForTimeout(1e3);
  });
  test("As a User choose the IDProof Document From AddBanned Customer Page", async () => {
    const testData4 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "IDProofDocument"
    );
    const document = testData4[0];

    if (document) {
      console.log("IdProof Document :" + document);
      await bannedCustomerPage.selectIdProofDocument(document);
    } else {
      console.log("IDProof Document is not Selected");
    }
  });
  test("Verify Warning Message IDProofNumber without enter the test data from IDProofNumber field from Add BannedCustomer Page ", async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.verifyWarningMessageIDProofNumber();
    await page.waitForTimeout(1e3);
  });
  test("As a User to enter the IdProofNumber from IdProofNumber field in the Add Banned Customer Page. ", async () => {
    const testData5 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add New Customer-Form",
      "IDProofNumber"
    );
    const IDProofNumber = testData5[0];
    if (IDProofNumber) {
      await bannedCustomerPage.addBandCustmoreIdProofNumber(IDProofNumber);
    } else {
      console.log("IDProofNumber is Not Entered");
    }
  });
  //today
  test("As a User to enter the SpecialCharcter from all the fields in Add BannedCustomer Page Should verify the Warning Message", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add new customer Form - Special Characters",
      "Customer ID"
    );
    const customerId = testData[0];
    if (customerId) {
      console.log("customerId:" + customerId);
      await bannedCustomerPage.enterCustomerID(customerId);
    } else {
      console.error("Customer Id is not Entered.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add new customer Form - Special Characters",
      "CustomerName"
    );
    const customerName = testData1[0];

    if (customerName) {
      console.log("customerName:" + customerName);
      await bannedCustomerPage.addBandCustmoreCustmoreName(customerName);
    } else {
      console.error("Customer Name is Not Entered");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add new customer Form - Special Characters",
      "Address"
    );
    const address = testData2[0];

    if (address) {
      console.log("Address :" + address);
      await bannedCustomerPage.enterAddressInput(address);
    } else {
      console.log("Address is Not Entered");
    }

    const testData3 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add new customer Form - Special Characters",
      "IDProofNumber"
    );
    const IDProofNumber = testData3[0];
    if (IDProofNumber) {
      await bannedCustomerPage.addBandCustmoreIdProofNumber(IDProofNumber);
    } else {
      console.log("IDProofNumber is Not Entered");
    }

    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.verifyWarningMessageCustomerID();
    await bannedCustomerPage.verifyWMessageCNameandIDPNumberSpecialCharacter(); //2 fun
    await bannedCustomerPage.verifyWarningMessageAddressSpecialChar();
  });
  test("As a User click on close button from Add Banned Customer Page.Redirect into the Banned Customer Page", async () => {
    const bannedPageUrl = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add new customer page - Cancel Button - Redirection",
      "VerifyBannedCustomerPageURL"
    );
    const url = bannedPageUrl[0];
    await bannedCustomerPage.closeButtonBottom();
    await bannedCustomerPage.verifyBannedCustomerPageUrlAfterCloseButton(url);
  });

  test('As a USer to enter the details from Add Banned customer Page,after to click on the save button.should show the "New Customer details added."', async () => {
    await dashBoardPage.navigateToAddNewCustomerPage();
    await page.waitForLoadState("load");
    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "CustomerName"
    );
    const customerName = testData1[0];
    console.log("customerName:" + customerName);
    if (customerName) {
      await bannedCustomerPage.addBandCustmoreCustmoreName(customerName);
    } else {
      console.error("Customer Name is Not Entered");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "MobileNumber"
    );
    const mobilNumber = testData2[0];
    if (mobilNumber) {
      const mNumber = mobilNumber.toString();
      console.log("Reading MobilNumber :" + mNumber);
      await bannedCustomerPage.enterMobileNumber(mNumber);
    } else {
      console.error("Mobile Number is Not Entered");
    }

    const testData3 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "Address"
    );
    const address = testData3[0];

    if (address) {
      console.log("Address :" + address);
      await bannedCustomerPage.enterAddressInput(address);
    } else {
      console.log("Address is Not Entered");
    }

    //document Type:
    const testData4 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofDocument"
    );
    const document = testData4[0];

    if (document) {
      console.log("IdProof Document :" + document);
      await bannedCustomerPage.selectIdProofDocument(document);
    } else {
      console.log("IDProof Document is not Selected");
    }

    const testData5 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofNumber"
    );
    const IDProofNumber = testData5[0];

    if (IDProofNumber) {
      await bannedCustomerPage.addBandCustmoreIdProofNumber(IDProofNumber);
    } else {
      console.log("IDProofNumber is Not Entered");
    }
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.verifyMessage("New Customer details added.", true);
    const bannedPageUrl = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Add new customer page - Cancel Button - Redirection",
      "VerifyBannedCustomerPageURL"
    );
    const url = bannedPageUrl[0];
    await bannedCustomerPage.verifyBannedCustomerPageUrlAfterCloseButton(url);
  });
  test('After click on save button from Banned customer Page,redirect into the Banned customer Page to validate the Id Prood Document value should be "Select".', async () => {
    await bannedCustomerPage.defaultDropdownValue();
  });
  test('As a User to Re-enter the same test data from a Add banned Customer Page,Should prompt message "Customer already exists."', async () => {
    test.setTimeout(300e3);

    await dashBoardPage.navigateToAddNewCustomerPage();
    await page.waitForLoadState("load");
    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "CustomerName"
    );
    const customerName = testData1[0];
    console.log("customerName:" + customerName);
    if (customerName) {
      await bannedCustomerPage.addBandCustmoreCustmoreName(customerName);
    } else {
      console.error("Customer Name is Not Entered");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "MobileNumber"
    );
    const mobilNumber = testData2[0];
    if (mobilNumber) {
      const mNumber = mobilNumber.toString();
      console.log("Reading MobilNumber :" + mNumber);
      await bannedCustomerPage.enterMobileNumber(mNumber);
    } else {
      console.error("Mobile Number is Not Entered");
    }

    const testData3 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "Address"
    );
    const address = testData3[0];

    if (address) {
      console.log("Address :" + address);
      await bannedCustomerPage.enterAddressInput(address);
    } else {
      console.log("Address is Not Entered");
    }
    const testData4 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofDocument"
    );
    const document = testData4[0];

    if (document) {
      console.log("IdProof Document :" + document);
      await bannedCustomerPage.selectIdProofDocument(document);
    } else {
      console.log("IDProof Document is not Selected");
    }

    const testData5 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofNumber"
    );
    const IDProofNumber = testData5[0];

    if (IDProofNumber) {
      await bannedCustomerPage.addBandCustmoreIdProofNumber(IDProofNumber);
    } else {
      console.log("IDProofNumber is Not Entered");
    }
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.verifyMessage("Customer already exists.", false);
  });
  test("As a User to click on close button from a Add Banned Custmore Page,its redirected into the Banned custmore Page. ", async () => {
    await bannedCustomerPage.closeButtonBottom();
    await page.waitForTimeout(3e3);
  });
  test("As a User to search the custmore details from a banned custmore page,validate all the field validations only.", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "CustomerName"
    );
    const customerName = testData[0];

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofDocument"
    );

    if (testData1.length > 0) {
      for (const IdProofDocument of testData1) {
        console.log("Id ProofDocument Dropdown values :" + IdProofDocument); // Print each ID proof document
        await bannedCustomerPage.selectIdProofDocument(IdProofDocument);
        await page.waitForTimeout(1000);
      }
    } else {
      console.error("No valid test data found for ID Proof Document.");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofNumber"
    );

    if (testData2.length > 0) {
      for (const IDProofNoField of testData2) {
        console.log("IDProofNo Reading:" + IDProofNoField);
        await bannedCustomerPage.enterIdProofNo(IDProofNoField);
      }
    } else {
      console.error("No valid test data found for IDProofNo field.");
    }
    await page.waitForTimeout(3000);
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(2e3);
    await bannedCustomerPage.validationCustomerDetails();
    await bannedCustomerPage.assertCheckboxCheckedStatus(true);
    await bannedCustomerPage.remarkFieldTextArea("");
  });
  test(
    "As a User, verify the input values from fields in a customer details form on the banned customer page.",
    { setTimeout: 5000 },
    async () => {
      const customerName = await excelReader.readData(
        "TestData/TestDataBeaconProject.xlsx",
        "BannedCustomerSheet",
        "Create Add new customer form - Enter Valid Data",
        "CustomerName"
      );
      const address = await excelReader.readData(
        "TestData/TestDataBeaconProject.xlsx",
        "BannedCustomerSheet",
        "Create Add new customer form - Enter Valid Data",
        "Address"
      );
      const document = await excelReader.readData(
        "TestData/TestDataBeaconProject.xlsx",
        "BannedCustomerSheet",
        "Create Add new customer form - Enter Valid Data",
        "IDProofDocument"
      );
      const IDProofNumber = await excelReader.readData(
        "TestData/TestDataBeaconProject.xlsx",
        "BannedCustomerSheet",
        "Create Add new customer form - Enter Valid Data",
        "IDProofNumber"
      );
      const mobileNumber = await excelReader.readData(
        "TestData/TestDataBeaconProject.xlsx",
        "BannedCustomerSheet",
        "Create Add new customer form - Enter Valid Data",
        "MobileNumber"
      );

      await bannedCustomerPage.verifyInputValuesFromCustomerDetailForm(
        "",
        customerName[0],
        address[0],
        document[0],
        IDProofNumber[0],
        mobileNumber[0]
      );
    }
  );

  test("As a User to enter the spectial character in Remarks filed from the customer details", async () => {
    const remarksInput = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "CustomerDetails From BannedCustomerPage-SpecialCharacter",
      "Remarks"
    );
    await bannedCustomerPage.enterRemarkField(remarksInput[0]);
    await bannedCustomerPage.clickOnSaveButton();
  });
  test("As a User to validate the PopUp when click on save button from customer details page.", async () => {
    await bannedCustomerPage.afterClickOnSavePopUpValidationsCustomerDetails();
  });
  test("Asa User to close the Confirm-Popup,When click on Save Button from customer-Details form", async () => {
    await bannedCustomerPage.confirmPopupCloseButton();
  });
  test("As a user to click on save button,get a popup its showing like Are you sure?(YeS or No),When click on No button close the confirm PopUp.", async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.noButtonconfirmPopUp();
  });
  test('As a User to enter the specilcharacter from the Remarks filed,whem click on yes its showing the Warning-Message like "Some error occured."', async () => {
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.yesButtonConfirmPopup();
    await bannedCustomerPage.warningMessagesomeErrorOccured();
  });
  test("As a User to enter the valid Name for Remarks field,When click on save button,showes as a popup after to click on Yes,showes as a Customer details updated", async () => {
    const remarksInput = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "CustomerDetails From BannedCustomerPage-Valid",
      "Remarks"
    );
    await bannedCustomerPage.enterRemarkField(remarksInput[0]);
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.yesButtonConfirmPopup();
    await bannedCustomerPage.SucessMessageForCustomerdetailsupdated();
    console.log("Customer details updated After click on Save button");
  });
  test("As a User to search the customer details from banned customer page,below showes as customer details. ", async () => {
    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "CustomerName"
    );
    const customerName = testData[0];

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofDocument"
    );

    if (testData1.length > 0) {
      for (const IdProofDocument of testData1) {
        console.log("Id ProofDocument Dropdown values :" + IdProofDocument); // Print each ID proof document
        await bannedCustomerPage.selectIdProofDocument(IdProofDocument);
        await page.waitForTimeout(1000);
      }
    } else {
      console.error("No valid test data found for ID Proof Document.");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofNumber"
    );

    if (testData2.length > 0) {
      for (const IDProofNoField of testData2) {
        console.log("IDProofNo Reading:" + IDProofNoField);
        await bannedCustomerPage.enterIdProofNo(IDProofNoField);
      }
    } else {
      console.error("No valid test data found for IDProofNo field.");
    }

    await bannedCustomerPage.clickSearchButton();
  });
  test('As a User Customer status is updated to unbanned. Should show a confirmation message "Customer details updated." is displayed.', async () => {
    await bannedCustomerPage.uncheckCheckMarkStatus(); //uncheck For Status
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.yesButtonConfirmPopup();
    await bannedCustomerPage.SucessMessageForCustomerdetailsupdated();

    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "CustomerName"
    );
    const customerName = testData[0];

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofDocument"
    );

    if (testData1.length > 0) {
      for (const IdProofDocument of testData1) {
        console.log("Id ProofDocument Dropdown values :" + IdProofDocument); // Print each ID proof document
        await bannedCustomerPage.selectIdProofDocument(IdProofDocument);
        await page.waitForTimeout(1000);
      }
    } else {
      console.error("No valid test data found for ID Proof Document.");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofNumber"
    );

    if (testData2.length > 0) {
      for (const IDProofNoField of testData2) {
        console.log("IDProofNo Reading:" + IDProofNoField);
        await bannedCustomerPage.enterIdProofNo(IDProofNoField);
      }
    } else {
      console.error("No valid test data found for IDProofNo field.");
    }
    await page.waitForTimeout(3000);
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(2e3);
    await bannedCustomerPage.assertCheckboxCheckedStatus(false);
  });

  test('As a User Customer status is updated to banned.Should show a confirmation message "Customer details updated." is displayed.', async () => {
    await bannedCustomerPage.uncheckCheckMarkStatus(); //check Mark For Status
    await bannedCustomerPage.clickOnSaveButton();
    await bannedCustomerPage.yesButtonConfirmPopup();
    await bannedCustomerPage.SucessMessageForCustomerdetailsupdated();

    const testData = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "CustomerName"
    );
    const customerName = testData[0];

    if (customerName) {
      await bannedCustomerPage.enterCustomerName(customerName);
    } else {
      console.error("No valid test data found for Customer Name field.");
    }

    const testData1 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofDocument"
    );

    if (testData1.length > 0) {
      for (const IdProofDocument of testData1) {
        console.log("Id ProofDocument Dropdown values :" + IdProofDocument); // Print each ID proof document
        await bannedCustomerPage.selectIdProofDocument(IdProofDocument);
        await page.waitForTimeout(1000);
      }
    } else {
      console.error("No valid test data found for ID Proof Document.");
    }

    const testData2 = await excelReader.readData(
      "TestData/TestDataBeaconProject.xlsx",
      "BannedCustomerSheet",
      "Create Add new customer form - Enter Valid Data",
      "IDProofNumber"
    );

    if (testData2.length > 0) {
      for (const IDProofNoField of testData2) {
        console.log("IDProofNo Reading:" + IDProofNoField);
        await bannedCustomerPage.enterIdProofNo(IDProofNoField);
      }
    } else {
      console.error("No valid test data found for IDProofNo field.");
    }
    await page.waitForTimeout(3000);
    await bannedCustomerPage.clickSearchButton();
    await page.waitForTimeout(2e3);
    await bannedCustomerPage.assertCheckboxCheckedStatus(true);
  });
});
