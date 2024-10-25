
const { test, expect } = require('@playwright/test');
const { TIMEOUT } = require('dns/promises');
const { timeout } = require('../playwright.config');

const ExcelReader = require('../Utility/ExcelReader');
const { stat } = require('fs');
const exp = require('constants');

class BannedCustomerPage{
    constructor(page){
    this.page=page;
    this.customerNameField = '//label[text()="Customer Name"]';
    this.idProofDocumentField = '//label[text()="ID Proof Document"]';
    this.idProofNoField = '//label[text()="ID Proof Number"]';
    this.addNewCustomerButton = '//a[text()="Add New Customer"]';
    this.searchButton = '//button[text()="Search"]';
    this.resetButton = '//button[@type="reset"]';
    this.closeButton = '//button[text()="Close"]';
    this.customerNameInput = '(//label[text()="Customer Name"] |  //input[@tvalue="string"])[2]';
    this.idProofDocumentInput = '.rz-dropdown';
    this.idProofNoInput = '(//label[text()="ID Proof Number"] |  //input[@tvalue="string"])[3]'; 
    this.submitButton = '#submitButton';
    this.custmoreNameWarning = '//p[text()="Please enter the Customer Name."]';
    this.selectIDProofDocumentWarning='//p[text()="Please Select ID Proof Document."]';
    this.idProofDropdown = '.rz-dropdown-label';
    this.options = {
      AADHAR: '//li[@aria-label=">AADHAR"]',
      PAN: '//li[@aria-label=">PAN"]',
      VOTER_ID: '//li[@aria-label=">VOTER ID"]',
      PASSPORT: '//li[@aria-label=">PASSPORT"]'
    };
    this.idProofNumberWarning='//p[text()="Please enter Valid ID Proof Number."]';
    this.idProofNoDropdown=`(//label[text()="ID Proof Number"]|//input[@tvalue="string"])[3]`;
    this.alertMessageCustMoreNameSpecialch=`//div[text()="Invalid Customer Name"]`;
    this.alertMessageIDProofNumberSpecialch=`//div[text()="Invalid ID Proof Number"]`;
    this.selectDropdownText='//label[text()="Select"]';
    this.noRecordsFounds='//p[text()="No records found."]';
    this.customerIdField = `//label[text()="Customer ID"]`;
    this.mobileNumberField ='//label[text()="Mobile Number"]';
    this.addressField = '//label[text()="Address"]';
    this.saveButton = `//button[text()="Save"]`;
    //addBannedCustmorePagelocators
    this.mobileNumberInput = '(//label[text()="Mobile Number"]|//input[@type="text"])[2]';
    this.customerIdInput = '(//label[text()="Customer ID"]|//input[@tvalue="string"])[2]';
    this.addBannedCustmoreCustmoreName=`(//label[text()="Customer Name"]|//input[@tvalue="string"])[3]`;
    this.addressInput = ".rz-textarea";
    this.addBannedIDProofNumberInput=`(//label[text()="ID Proof Number"]|//input[starts-with(@class,"rz-textbox")])[5]`;
    this.addBannedCustmorePageCusmoreNameWarning=`//p[text()="Please enter the Customer name."]`;
    this.addBannedPageMobileNumberWarning=`//p[text()="Please enter the Mobile Number."]`;
    this.addBannedPageAddressWarning='//p[text()="Please enter the Address."]';
    this.addBannedPageIDProofNumber=`//p[text()="Please enter  ID proof Number."]`;
    this.addBannedPageCustomerId=`//div[text()="Invalid Customer ID"]`;
    this.addBannedPageAddressWarningSpecialchar='//div[text()="Invalid Address"]';
    this.successMessage=`//p[text()="New Customer details added."]`;
    this.errorMessage=`//p[text()="Customer already exists."]`;
    //customer-Details-Locator
    this.customerDetails=`//h6[text()="Customer Details"]`;
    this.iDProofNo=`//label[text()="ID Proof No"]`;
    this.mobileNo=`//label[text()="Mobile No"]`;
    this.status=`//label[text()="Status"]`;
    this.statuscheckMark=`//input[@type="checkbox"]`;
    this.remarks=`//label[text()="Remarks"]`;
    this.customerNameCDetails=`(//label[text()="Customer Name"])[2]`;
    this.iDProofDocumentDetails=`(//label[text()="ID Proof Document"])[2]`;
    this.remarkField=`//textarea[@name="Remarks"]`;
    //customer-Details-Input-locators
    this.CustomerIDinput=`//div[@class="mycard-header row cardsheadings"]//..//label[text()="Customer ID"]//following-sibling::label`;
    this.customerNameInputCDetails=`//div[@class="mycard-header row cardsheadings"]//..//label[text()="Customer Name"]//following-sibling::label`;
    this.addressinput=`//div[@class="mycard-header row cardsheadings"]//..//label[text()="Address"]//following-sibling::label`;
    this.idProofDocumentInput=`//div[@class="mycard-header row cardsheadings"]//..//label[text()="ID Proof Document"]//following-sibling::label`;
    this.idProofNo=`//div[@class="mycard-header row cardsheadings"]//..//label[text()="ID Proof No"]//following-sibling::label`;
    this.mobileNoInput=`//div[@class="mycard-header row cardsheadings"]//..//label[text()="Mobile No"]//following-sibling::label`;
  //popup-locators
  this.confirm=`//span[text()="Confirm"]`;
  this.areYouSure=`//p[text()="Are you sure?"]`;
  this.yes=`//span[text()="Yes"]`;
  this.no=`//span[text()="No"]`;
  this.closeButtonPopup=`//a[@role="button"]`;
  this.someErrorOccured=`//p[text()="Some error occured."]`;
  this.customerdetailsupdated=`//p[text()="Customer details updated."]`;
  
  }
    async verifyBannedCustomerPageElements() {
        await expect(this.page.locator(this.customerNameField)).toBeVisible();
        await expect(this.page.locator(this.idProofDocumentField)).toBeVisible();
        await expect(this.page.locator(this.idProofNoField)).toBeVisible();
        await expect(this.page.locator(this.addNewCustomerButton)).toBeVisible();
        await expect(this.page.locator(this.searchButton)).toBeVisible();
        await expect(this.page.locator(this.resetButton)).toBeVisible();
        await expect(this.page.locator(this.closeButton)).toBeVisible();
      }
      
    async clickSearchButton() {
      await this.page.waitForSelector(this.searchButton,{ state: 'visible' });
      await this.page.click(this.searchButton,{ force: true });
    }
    async verifyWarningMessageCustmoreName() {
    await this.page.waitForSelector(this.custmoreNameWarning,{state:'visible'});
    await expect(this.page.locator(this.custmoreNameWarning)).toBeVisible();
    }


    async enterCustomerName(ValidcustomerName) {

    await this.page.waitForSelector(this.customerNameInput,{state:'visible'});
    await this.page.fill(this.customerNameInput,ValidcustomerName);
    const custmoreNameValue = await this.page.inputValue(this.customerNameInput);
    const custmoreNameLength = custmoreNameValue.length;
    console.log("Please Enter the character from the Custmore Name field should allowed 0-50 ")
    console.log(`Entered custmoreName: ${custmoreNameValue}, Entered custmoreName Length: ${custmoreNameLength}`);

    if(custmoreNameValue.length<0)
      {
        throw new Error('Customer name should not accept less than 0 characters.');
      }
      else if(custmoreNameValue.length>50){
      throw new error ('Customer name should not accept more than 50 characters.')
    }

     }
    async verifyWarningMessageselectIDProofDocument(){
      await this.page.waitForSelector(this.selectIDProofDocumentWarning,{state:'visible'});
      await expect(this.page.locator(this.selectIDProofDocumentWarning)).toBeVisible();
    }
    async selectIdProofDocument(option,IdProofNumber) {
      await this.page.waitForSelector(this.idProofDropdown,{state:'visible'});
      await this.page.click(this.idProofDropdown);
      //await this.page.click(this.options[option]);

      switch (option) {
        case 'AADHAR':
            await this.page.click(this.options.AADHAR); 
            break;
        case 'PAN':
            await this.page.click(this.options.PAN); 
            break;
        case 'VOTER ID':
            await this.page.click(this.options.VOTER_ID); 
            break;
        case 'PASSPORT':
            await this.page.click(this.options.PASSPORT);
            break;
        default:
            console.error(`ID Proof Document "${option}" not recognized.`);
            throw new Error(`ID Proof Document "${option}" is not valid.`);
    }
    }
    async verifyWarningMessageIdProofNumber(){
      await this.page.waitForSelector(this.idProofNumberWarning,{state:'visible'});
      await expect(this.page.locator(this.idProofNumberWarning)).toBeVisible();
    }
    async enterIdProofNo(idNo) {
      await this.page.waitForSelector(this.idProofNoDropdown,{state:'visible'})
      await this.page.click(this.idProofNoDropdown);
      await this.page.fill(this.idProofNoInput,idNo);
      const idProofNoValue=await this.page.inputValue(this.idProofNoInput);
      const idProofNoLength= idProofNoValue.length;
      console.log("Please Enter the character from the ID Proof Number field should allowed is 0-20");
      console.log(`Entered  ID Proof Number:${idProofNoValue},idProofNoLength:${idProofNoLength}`);
      if(idProofNoValue.length<0){
        throw new error ('ID Proof Number  should not accept less than 0 characters.')
      }
      else if(idProofNoValue.length>20){
        throw new error ('ID Proof Number  should not accept more than 20 characters.')
      }
    }
    async clickonResetButton(){
      await this.page.waitForSelector(this.resetButton,{state:'visible'});
      await this.page.click(this.resetButton);
    }
    async validationInputFieldsAfterReset(){
    const expectedcustmoreNameInput='';
    const expectedidProofDocumentInput='Select';
    const expectedidProofNoInput='';

    await this.page.waitForSelector(this.customerNameInput,{state:'visible'})
    const custmoreNameInput=await this.page.locator(this.customerNameInput).inputValue();
    expect(custmoreNameInput).toBe(expectedcustmoreNameInput);
    console.log("CustmoreName Input Field :"+expect(custmoreNameInput).toBe(expectedcustmoreNameInput));

    await this.page.waitForSelector(this.selectDropdownText,{state:'visible'});
    const idProofDocumentInput = await this.page.locator(this.selectDropdownText).textContent();
    expect(idProofDocumentInput).toContain(expectedidProofDocumentInput);
    console.log("Id Proof Document Input Field:"+expect(idProofDocumentInput).toContain(expectedidProofDocumentInput));

    await this.page.waitForSelector(this.idProofNoInput,{state:'visible'})
    const idProofNoInput =await this.page.locator(this.idProofNoInput).inputValue();
    expect(idProofNoInput).toBe(expectedidProofNoInput);
    console.log("Id Proof Number Input Field:"+expect(idProofNoInput).toBe(expectedidProofNoInput));
    }
    async verifyWMessageCNameandIDPNumberSpecialCharacter(){
      await this.page.waitForSelector(this.alertMessageCustMoreNameSpecialch,{state:'visible'});
      expect(await this.page.locator(this.alertMessageCustMoreNameSpecialch)).toBeVisible();
      await this.page.waitForSelector(this.alertMessageIDProofNumberSpecialch,{state:'visible'});
      expect(await this.page.locator(this.alertMessageIDProofNumberSpecialch)).toBeVisible();

    }
    async closeButtonBottom(){
      await this.page.click(this.closeButton);
    }
    async noRecordsFound() {
       
        await expect(this.page.locator(this.noRecordsFounds)).toBeVisible();
        console.log("No records found message is visible.");
      
    }
      
    
    async verifyAddNewCustomerPageDisplayed() {
      expect(await this.page.locator(this.customerIdField).isVisible());
      expect(await this.page.locator(this.customerNameField).isVisible());
      expect(await this.page.locator(this.mobileNumberField).isVisible());
      expect(await this.page.locator(this.addressField).isVisible());
      expect(await this.page.locator(this.idProofDocumentField).isVisible());
      expect(await this.page.locator(this.idProofNoField).isVisible());
      expect(await this.page.locator(this.saveButton).isVisible());
      expect(await this.page.locator(this.resetButton).isVisible());
      expect(await this.page.locator(this.closeButton).isVisible());
    }

    
    async enterCustomerID(customerIDInput) {
      await this.page.waitForSelector(this.customerIdInput, { state: 'visible' });
      await this.page.locator(this.customerIdInput).fill(customerIDInput);
      const enteredCustomerIDValue = await this.page.locator(this.customerIdInput).inputValue();
      console.log("CustmoreID input box Range should be  0-20");
      if(enteredCustomerIDValue.length>=0 && enteredCustomerIDValue.length<=20)
      {
        console.log(`CustmoreIDvalue:${enteredCustomerIDValue},CustmoreIDLength:${enteredCustomerIDValue.length}`)
      }
      
  }
  
    async clickOnSaveButton(){
      await this.page.waitForSelector(this.saveButton,{state:'visible'});
      await this.page.locator(this.saveButton).click();
    }
    async enterMobileNumber(validMobileNumber) {
      await this.page.waitForSelector(this.mobileNumberInput,{state:'visible'});
      await this.page.fill(this.mobileNumberInput,validMobileNumber);
      const mobileNumberValue=await this.page.locator(this.mobileNumberInput).inputValue();
      console.log("Mobile Number text box should be allowed 0 to 10");
      if(mobileNumberValue.length>=0 && mobileNumberValue.length<=10)
      {
        console.log(`Entered MobileNumber:${mobileNumberValue},Mobile Number Length:${mobileNumberValue.length}`);
      }
    }
    async addBandCustmoreCustmoreName(ValidcustomerName){
    

      await this.page.waitForSelector(this.addBannedCustmoreCustmoreName,{state:'visible'});
      await this.page.fill(this.addBannedCustmoreCustmoreName,ValidcustomerName);
      const custmoreNameValue = await this.page.inputValue(this.addBannedCustmoreCustmoreName);
      const custmoreNameLength = custmoreNameValue.length;
      console.log("Please Enter the character from the Custmore Name field should allowed 0-50 ")
      console.log(`Entered custmoreName: ${custmoreNameValue}, Entered custmoreName Length: ${custmoreNameLength}`);
  
      if(custmoreNameValue.length<0)
        {
          throw new Error('Customer name should not accept less than 0 characters.');
        }
        else if(custmoreNameValue.length>50){
        throw new error ('Username  should not accept more than 50 characters.')
      }
    }
    async enterAddressInput(addressInput){
      await this.page.waitForSelector(this.addressInput,{state:'visible'});
      await this.page.fill(this.addressInput, addressInput);
      const inputAddressText=await this.page.locator(this.addressInput).inputValue();
      console.log("Address text box should be allowed 0 to 100")
      if(inputAddressText.length>=0 && inputAddressText.length<=100){
        console.log(`Entered Address:${inputAddressText},Address Length:${inputAddressText.length}`);
      }
    }
    async addBandCustmoreIdProofNumber(validIDProofNumberAadhar){
      await this.page.waitForSelector(this.addBannedIDProofNumberInput,{state:'visible'});
      await this.page.fill(this.addBannedIDProofNumberInput,validIDProofNumberAadhar);
      const idProofNumber=await this.page.locator(this.addBannedIDProofNumberInput).inputValue();
      console.log("Id Proof Number text box should be allowed 0-12");
      if(idProofNumber.length>=0 && idProofNumber.length<=12){
        console.log(`Entered Id Proof Number:${idProofNumber},IdProofNumber Length:${idProofNumber.length}`);
    }
  }
    async verifyAllInputValuesAddBanneCustmorePageAfterReset(){
     const expectedCustmoreId='';
     const expectedCustmoreName='';
     const expectedMobileNumber='';
     const expectedAddress='';
     const expectedIDProofDocument="Select";
     const expectedIDProofNumber='';

    
    await this.page.waitForSelector(this.customerIdInput,{state:'visible'})
    const custmoreNameIDInput=await this.page.locator(this.customerIdInput).inputValue();
    console.log("Customer ID Input:"+expect(custmoreNameIDInput).toBe(expectedCustmoreId));

    await this.page.waitForSelector(this.addBannedCustmoreCustmoreName,{state:'visible'})
    const custmoreNameInput=await this.page.locator(this.addBannedCustmoreCustmoreName).inputValue();
    console.log("Customer Name Input:"+expect(custmoreNameInput).toBe(expectedCustmoreName));

    await this.page.waitForSelector(this.mobileNumberInput,{state:'visible'})
    const custmoreMobileNumberInput=await this.page.locator(this.mobileNumberInput).inputValue();
    console.log("Mobile Number Input:"+expect(custmoreMobileNumberInput).toBe(expectedMobileNumber));

    await this.page.waitForSelector(this.addressInput,{state:'visible'})
    const AddressInput=await this.page.locator(this.addressInput).inputValue();
    console.log("Address Input:"+expect(AddressInput).toBe(expectedAddress));


    await this.page.waitForSelector(this.selectDropdownText,{state:'visible'});
    const idProofDocumentInput = await this.page.locator(this.selectDropdownText).textContent();
    console.log("Id proof Document Dropdown Input:"+idProofDocumentInput);
    console.log("ID Proof Document Input:"+expect(idProofDocumentInput.trim()).toBe(expectedIDProofDocument.trim()));

    await this.page.waitForSelector(this.addBannedIDProofNumberInput,{state:'visible'})
    const idProofNumberInput=await this.page.locator(this.addBannedIDProofNumberInput).inputValue();
    console.log("ID Proof Number:"+expect(idProofNumberInput).toBe(expectedIDProofNumber));

    }
    async addBannedCustmorePageCustmoreNameWarning(){
      const isVisible = await this.page.locator(this.addBannedCustmorePageCusmoreNameWarning).isVisible();
      console.log(`Warning Message Custmore Name Is visible: ${isVisible}`);
      expect(isVisible).toBe(true);
    }
    async verifyWarningMessageMobilNumber(){
      await this.page.waitForSelector(this.addBannedPageMobileNumberWarning, { state: 'visible' });
      const isVisible = await this.page.locator(this.addBannedPageMobileNumberWarning).isVisible();
      console.log(`Warning Message Mobile Number Is visible: ${isVisible}`);
      expect(isVisible).toBe(true);

    }
async verifyWarningMessageAddress(){
    await this.page.waitForSelector(this.addBannedPageAddressWarning,{state:'visible'})
    const isVisible= await this.page.locator(this.addBannedPageAddressWarning).isVisible();
    console.log(`Warning Message Address Is visible: ${isVisible}`);
    expect(isVisible).toBe(true);
}


async verifyWarningMessageIDProofNumber(){
  await this.page.waitForSelector(this.addBannedPageIDProofNumber,{state:'visible'});
  const isVisible= await this.page.locator(this.addBannedPageIDProofNumber).isVisible();
    console.log(`Warning Message ID proof Number Is visible: ${isVisible}`);
    expect(isVisible).toBe(true);
}
async verifyWarningMessageCustomerID(){
  await this.page.waitForSelector(this.addBannedPageCustomerId,{state:'visible'});
  const isVisible= await this.page.locator(this.addBannedPageCustomerId).isVisible();
  console.log(`Warning Message Customer ID Is visible: ${isVisible}`);
  expect(isVisible).toBe(true);
}
async verifyWarningMessageAddressSpecialChar(){

  await this.page.waitForSelector(this.addBannedPageAddressWarningSpecialchar,{state:'visible'});
  const isVisible= await this.page.locator(this.addBannedPageAddressWarningSpecialchar).isVisible();
  console.log(`Warning Message Address Is visible: ${isVisible}`);
  expect(isVisible).toBe(true);
}
 async verifyBannedCustomerPageUrlAfterCloseButton(expectedUrl) {
  const currentUrl = await this.page.url();
  console.log("HomePage URL:"+currentUrl);
  expect(currentUrl).toBe(expectedUrl);

}
async verifyMessage(expectedMessage, isSuccess) {
  const messageSelector = isSuccess ? this.successMessage : this.errorMessage;
  const message = await this.page.textContent(messageSelector);
  expect(message).toBe(expectedMessage);
}

async defaultDropdownValue(){
  const expectedIDProofDocument="Select";
  await this.page.waitForSelector(this.selectDropdownText,{state:'visible'});
  const idProofDocumentInput = await this.page.locator(this.selectDropdownText).textContent();
  console.log("Id proof Document Dropdown Input:"+idProofDocumentInput);
  expect(idProofDocumentInput).toContain("");
  console.log("ID Proof Document Input:"+expect(idProofDocumentInput.trim()).toBe(expectedIDProofDocument.trim()));
}
async validationCustomerDetails(){
  await expect(this.page.locator(this.customerDetails)).toBeVisible();
  await expect(this.page.locator(this.customerIdField)).toBeVisible();
  await expect(this.page.locator(this.customerNameCDetails)).toBeVisible();
  await expect(this.page.locator(this.addressField)).toBeVisible();
  await expect(this.page.locator(this.iDProofDocumentDetails)).toBeVisible();
  await expect(this.page.locator(this.iDProofNo)).toBeVisible();
  await expect(this.page.locator(this.mobileNo)).toBeVisible();
  await expect(this.page.locator(this.status)).toBeVisible();
  await expect(this.page.locator(this.remarks)).toBeVisible();
  await expect(this.page.locator(this.saveButton)).toBeVisible();

}
  async assertCheckboxCheckedStatus(expected) {
    const checkbox = await this.page.waitForSelector(this.statuscheckMark,{state:"visible"});
    const isChecked = await checkbox.isChecked();
    expect(isChecked).toBe(expected);
}
async remarkFieldTextArea(expected){
  await this.page.waitForSelector(this.remarkField,{state:'visible'});
  const inputvalueRemark=await this.page.locator(this.remarkField).inputValue();
  expect(inputvalueRemark).toBe(expected);

}
async verifyInputValuesFromCustomerDetailForm(cIDExpected, cNameExpected, addressExpected, idProofdocumentExpected, idProofNumberExpected, expectedMobileNumber ){

 const customerIdActual=await this.page.locator(this.CustomerIDinput).textContent();
 expect(customerIdActual).toBe(cIDExpected);

 
 const customerNameActual=await this.page.locator(this.customerNameInputCDetails).textContent();
 expect(customerNameActual).toBe(cNameExpected);


 const addressActual=await this.page.locator(this.addressinput).textContent();
 expect(addressActual).toBe(addressExpected);


 const idProofdocumentActual=await this.page.locator(this.idProofDocumentInput).textContent();
 expect(idProofdocumentActual).toBe(idProofdocumentExpected);



 const idProofNumberActual=await this.page.locator(this.idProofNo).textContent();
 expect(idProofNumberActual).toBe(idProofNumberExpected);


 const actualMobileNumber = await this.page.locator(this.mobileNoInput).textContent();
 expect(actualMobileNumber).toBe(expectedMobileNumber.toString());
}

async enterRemarkField(specialCharacter){
  await this.page.waitForSelector(this.remarkField,{state:'visible'});
  await this.page.locator(this.remarkField).fill(specialCharacter);
}
async afterClickOnSavePopUpValidationsCustomerDetails(){
  await this.page.waitForSelector(this.confirm,{state:'visible'});
  await expect(this.page.locator(this.confirm)).toBeVisible();

  await this.page.waitForSelector(this.areYouSure,{state:'visible'});
  await expect(this.page.locator(this.areYouSure)).toBeVisible();

  await this.page.waitForSelector(this.yes,{state:'visible'});
  await expect(this.page.locator(this.yes)).toBeVisible();

  await this.page.waitForSelector(this.no,{state:'visible'});
  await expect(this.page.locator(this.no)).toBeVisible();
}
async confirmPopupCloseButton(){
  await this.page.waitForSelector(this.closeButtonPopup, { state: 'visible' });
  await this.page.locator(this.closeButtonPopup).click();

}
async noButtonconfirmPopUp(){
  await this.page.waitForSelector(this.no,{state:'visible'});
  await this.page.locator(this.no).click();
}
async yesButtonConfirmPopup(){
  await this.page.waitForSelector(this.yes,{state:'visible'});
  await this.page.locator(this.yes).click();
}
async warningMessagesomeErrorOccured(){
  await this.page.waitForSelector(this.someErrorOccured,{state:'visible'});
  await expect(this.page.locator(this.someErrorOccured)).toBeVisible();

}
async SucessMessageForCustomerdetailsupdated (){

  await this.page.waitForSelector(this.customerdetailsupdated,{state:'visible'});
  await expect(this.page.locator(this.customerdetailsupdated)).toBeVisible();
}

}
module.exports={BannedCustomerPage};
