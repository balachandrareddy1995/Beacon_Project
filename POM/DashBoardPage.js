

const { test, expect } = require('@playwright/test');
const { timeout } = require('../playwright.config');
class DasBoardPage{

    constructor(page)
    {
        this.page=page;
        this.securityManagementDropdown ='//span[text()="Security Management"]';
        this.bannedCustomerOption = '//a[@href="/Admin/BannedCustomer"]';
        this.smaSummary=`//h6[text()="SMA Summary"]`;
        this.addNewCustomerButton = '//a[text()="Add New Customer"]';
        this.idProofDocumentInput = '.rz-dropdown';
        this.options = {
            AADHAR: '//li[@aria-label=">AADHAR"]',
            PAN: '//li[@aria-label=">PAN"]',
            VOTER_ID: '//li[@aria-label=">VOTER ID"]',
            PASSPORT: '//li[@aria-label=">PASSPORT"]'
          };
    }
    async navigateToBannedCustomer() {
        await this.page.waitForSelector(this.securityManagementDropdown,{ state: 'visible' });
        await this.page.locator(this.securityManagementDropdown).click();
        await this.page.waitForSelector(this.bannedCustomerOption,{ state: 'visible' });
        await this.page.locator(this.bannedCustomerOption).click();
        const getBannedCustmorePageUrl =await this.page.url();
        const getBannedCustmoreTitle=await this.page.title();
        console.log("Get BannedCustmore Page Url: "+getBannedCustmorePageUrl);
        console.log("Get BannedCustmore Page Title "+getBannedCustmoreTitle);
        
    }
    async verifyAnyOneOFTheElementInHomepage(){
        await this.page.waitForSelector(this.smaSummary,{state:'visible'});
        expect(await this.page.locator(this.smaSummary)).toBeVisible();
        console.log("Navigating into the Home Pagee");
        
    }
    async verifyHomePageUrlAfterCloseButton(expectedUrl) {
        const currentUrl = await this.page.url();
        console.log("HomePage URL:"+currentUrl);
        expect(currentUrl).toBe(expectedUrl);

      }
    async navigateToAddNewCustomerPage() {
        await this.page.waitForSelector(this.addNewCustomerButton,{state:'visible'});
        await this.page.locator(this.addNewCustomerButton).click();
      }
    
      async verifyIDProofDocumentTypesInSideDropdown(){
        await this.page.waitForSelector(this.idProofDocumentInput,{state:'visible'});
        await this.page.locator(this.idProofDocumentInput).click();
        await this.page.waitForTimeout(4e3);
        expect(await this.page.locator(this.options.AADHAR)).toBeVisible();
        expect(await this.page.locator(this.options.PAN)).toBeVisible();
        expect(await this.page.locator(this.options.PASSPORT)).toBeVisible();
        expect(await this.page.locator(this.options.VOTER_ID)).toBeVisible();
        await this.page.locator(this.idProofDocumentInput).click();
       }
}
module.exports={DasBoardPage};