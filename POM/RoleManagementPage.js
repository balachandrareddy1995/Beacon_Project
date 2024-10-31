
const { expect } = require('@playwright/test');
class RoleManagementPage{
constructor(page){
  this.page=page;
  // Role Management Page Selectors
  this.searchField = '//input[@placeholder="Search"]';
  this.activeCheckbox = '//div[starts-with(@class,"rz-chkbox-box rz-state-active")]';
  this.searchButton = '//button[text()="Search"]';
  this.addNewRoleButton = '//button[text()="Add New Role"]';
  this.roleNameField = '//input[@name="RoleName"]';
  this.SecurityManagementInput=`(//td[text()="Security Management"]/../td)[2]/table/tbody/tr/td/input`;
  this.saveButton=`//button[text()="Save"]`;
  this.successMessage=`//p[text()="Record Saved Successfully"]`;
  this.newRoleInList=`((//tbody/tr[starts-with(@class,"rz-datatable-even")])[1]/td)[1]`;
  this.greenTickIcon = '//tbody/tr[starts-with(@class,"rz-datatable-even")][1]/td//i';
  this.isActiveCheckbox=`//input[@type="checkbox"]`;
  this.resultRow=`(//tr[starts-with(@class,"rz-datatable-even")]/td)[1]/span`;
  this.resultStatus=`(//tr[starts-with(@class,"rz-datatable-even")]/td)[2]/span/i`;
}
async verifyRoleManagementPageElements() {

    await this.page.waitForSelector(this.searchField,{ state: 'visible' });
    await expect(this.page.locator(this.searchField)).toBeVisible();

    await this.page.waitForSelector(this.activeCheckbox,{ state: 'visible' });
    await expect(this.page.locator(this.activeCheckbox)).toBeVisible();

    await this.page.waitForSelector(this.searchButton,{ state: 'visible' });
    await expect(this.page.locator(this.searchButton)).toBeVisible();
    
    await this.page.waitForSelector(this.addNewRoleButton,{ state: 'visible' });
    await expect(this.page.locator(this.addNewRoleButton)).toBeVisible();
}
  async clickAddNewRole() {
    await this.page.click(this.addNewRoleButton);
  }
  async enterRoleName(roleName) {
    await this.page.waitForSelector(this.roleNameField,{state:"visible"});
    await this.page.locator(this.roleNameField).fill(roleName);
  }
  async SelectFunctionalitiesCheckBox() {
    await this.page.waitForSelector(this.SecurityManagementInput, { state: 'visible' });
    const checkboxes = this.page.locator(this.SecurityManagementInput);
    const count = await checkboxes.count();
    console.log("Input CheckBox For SecrimentManagement: "+count);

    for (let i = 0; i < count; i++) {
        await checkboxes.nth(i).click(); // Check the checkbox
        const isChecked = await checkboxes.nth(i).isChecked();
        console.log(`Checkbox ${i + 1} is checked: ${isChecked}`);
    } 
  }
  async clickSave() {
    await this.page.waitForSelector(this.saveButton,{state:'visible'});
    await this.page.click(this.saveButton);
  }
  async getSuccessMessage(sucessMessage) {
    await this.page.waitForSelector(this.successMessage,{state:'visible'});
   const suceessMessage= await this.page.textContent(this.successMessage);
   console.log("getSuccessMessage :"+suceessMessage);
   expect(suceessMessage).toBe(sucessMessage);
  }
  async isRoleDisplayed(roleName) {
    await this.page.waitForSelector(this.newRoleInList,{state:'visible'});
    const roleText = await this.page.textContent(this.newRoleInList);
    console.log(`Expected Role Name: "${roleName.trim()}"`);
    console.log("Actual Role Name: " + roleText.trim());
    expect(roleText.trim()).toEqual(roleName.trim());
   
  }
  async isGreenTickPresent() {
    await this.page.waitForSelector(this.greenTickIcon,{state:'visible'});
    const greenTickLocator = await this.page.locator(this.greenTickIcon);
    await expect(greenTickLocator).toBeVisible();

   
  }
  async checkIsActiveCheckbox() {
    await this.page.waitForSelector(this.isActiveCheckbox,{state:'visible'});
    const isChecked = await this.page.isChecked(this.isActiveCheckbox);
    if (!isChecked) {
      await this.page.click(this.isActiveCheckbox);
    }
  }
  async clickSearchButton() {
    await this.page.click(this.searchButton);
  }
  async enterRoleNameInSearchField(roleName) {
    await this.page.waitForSelector(this.searchField,{state:'visible'});
    await this.page.locator(this.searchField).fill(roleName);
  }
  async isRolePresentWithStatus(roleName) {
    //Row-text
    await this.page.waitForSelector(this.resultRow,{state:'visible'});
    const roleExists=await this.page.locator(this.resultRow).textContent();
    console.log(`Expected Role Name: "${roleName.trim()}"`);
    console.log("Actual Role Name: " + roleExists.trim());
    expect(roleExists.trim()).toEqual(roleName.trim());
     //greenTickLocator
    await this.page.waitForSelector(this.resultStatus,{state:'visible'});
    const greenTickLocator=await this.page.locator(this.resultStatus);
    expect(greenTickLocator).toBeVisible();
  }

}

module.exports={RoleManagementPage};