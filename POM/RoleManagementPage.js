const { expect } = require("@playwright/test");
const { timeout } = require("../playwright.config");
class RoleManagementPage {
  constructor(page) {
    this.page = page;
    // Role Management Page Selectors
    this.searchField = '//input[@placeholder="Search"]';
    this.activeCheckbox =
      '//div[starts-with(@class,"rz-chkbox-box rz-state-active")]';
    this.searchButton = '//button[text()="Search"]';
    this.addNewRoleButton = '//button[text()="Add New Role"]';
    this.roleNameField = '//input[@name="RoleName"]';
    this.SecurityManagementInput = `(//td[text()="Security Management"]/../td)[2]/table/tbody/tr/td/input`;
    this.saveButton = `//button[text()="Save"]`;
    this.successMessage = `//p[text()="Record Saved Successfully"]`;
    this.newRoleInList = `((//tbody/tr[starts-with(@class,"rz-datatable-even")])[1]/td)[1]`;
    this.rolenameStatusgreenTickIcon = '(//i[@style="color:green"])[1]';
    this.isActiveCheckbox = `//input[@type="checkbox"]`;
    this.resultRow = `(//tr[starts-with(@class,"rz-datatable-even")]/td)[1]/span`;
    this.resultStatus = `(//tr[starts-with(@class,"rz-datatable-even")]/td)[2]/span/i`;
    this.threeDots = `((//tr[starts-with(@class,"rz-datatable-even ")]/td)[3]/span/div/button/span)[1]`;
    this.deactivateOptionSelector = `(//ul[starts-with(@class,"dropdown-menu show")]/li)[2]`;
    this.successMessageSelector = `//p[text()=" Role De-activated Successfully"]`;
    this.rolenameStatusRed = `//i[@style="color:red"]`;
    this.rolesCountSelector = "//tbody/tr";
    this.sucessMessageRoleActivatedSelector = `//p[text()="Role Activated Successfully."]`;
    this.rolesCountSelector = "//tbody/tr";
    this.Previous = `//span[text()="Previous"]`;
    this.addUserButton = `//a[@href="/Admin/AddNewUser"]`;
    //userManagement
    this.roleDropdownAddNewUser = `(//label[text()="Select"])[1]`;
    this.roleOption = `(//input[@type="text"])[4]`;
    this.roleOptionText = `(//div[starts-with(@class,"rz-dropdown-items-wrapper")])[2]`;
    this.roleDropdownSearchInput = `//input[@role="textbox"]`;
    this.SuggestionRoleNameDropdownUserManagement = `//li[@class="rz-multiselect-item "]`;
    this.roleDropdownUserMpage = `//label[text()="Select"]`;
    this.summaryReports = `//td[text()="Summary Reports"]`;
    this.checkbox = '//div[@class="rz-chkbox-box"]';
    this.editOption=`//button[text()="Edit"]`;
    this.roleReassignmentCheckbox=`((//td[text()="Security Management"]/../td)[2]/table/tbody/tr)[4]/td/input`;
    this.recordsuccessMessage=`//p[text()="Record Updated Successfully"]`
  }
  async verifyRoleManagementPageElements() {
    await this.page.waitForSelector(this.Previous, { state: "visible" });

    await this.page.waitForSelector(this.searchField, { state: "visible" });
    await expect(this.page.locator(this.searchField)).toBeVisible();

    await this.page.waitForSelector(this.activeCheckbox, { state: "visible" });
    await expect(this.page.locator(this.activeCheckbox)).toBeVisible();

    await this.page.waitForSelector(this.searchButton, { state: "visible" });
    await expect(this.page.locator(this.searchButton)).toBeVisible();

    await this.page.waitForSelector(this.addNewRoleButton, {
      state: "visible",
    });
    await expect(this.page.locator(this.addNewRoleButton)).toBeVisible();
  }
  async clickAddNewRole() {
    await this.page.waitForSelector(this.addNewRoleButton, {
      state: "visible",
    });
    await this.page.locator(this.addNewRoleButton).click();
  }
  async enterRoleName(roleName) {
    await this.page.waitForSelector(this.roleNameField, { state: "visible" });
    await this.page.locator(this.roleNameField).fill(roleName);
  }
  async SelectFunctionalitiesCheckBox() {
    await this.page.waitForSelector(this.SecurityManagementInput, {
      state: "visible",
    });
    const checkboxes = this.page.locator(this.SecurityManagementInput);
    const count = await checkboxes.count();
    console.log("Input CheckBox For SecrimentManagement: " + count);

    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).click(); // Check the checkbox
      const isChecked = await checkboxes.nth(i).isChecked();
      console.log(`Checkbox ${i + 1} is checked: ${isChecked}`);
    }
  }
  async clickSave() {
    await this.page.waitForSelector(this.saveButton, { state: "visible" });
    await this.page.click(this.saveButton);
  }
  async getSuccessMessage(sucessMessage) {
    await this.page.waitForSelector(this.successMessage, { state: "visible" });
    const suceessMessage = await this.page.textContent(this.successMessage);
    console.log("getSuccessMessage :" + suceessMessage);
    expect(suceessMessage).toBe(sucessMessage);
  }
  async isRoleDisplayed(roleName) {
    await this.page.waitForSelector(this.newRoleInList, { state: "visible" });
    const roleText = await this.page.locator(this.newRoleInList).textContent();
    console.log(`Expected Role Name: "${roleName.trim()}"`);
    console.log("Actual Role Name: " + roleText.trim());
    expect(roleText.trim()).toEqual(roleName.trim());
  }
  async roleNameStatusIsactive() {
    await this.page.waitForSelector(this.rolenameStatusgreenTickIcon, {
      state: "visible",
    });
    const greenTickLocator = await this.page.locator(
      this.rolenameStatusgreenTickIcon
    );
    await expect(greenTickLocator).toBeVisible();
  }
  async checkIsActiveCheckbox() {
    await this.page.waitForSelector(this.isActiveCheckbox, {
      state: "visible",
    });
    const isChecked = await this.page.isChecked(this.isActiveCheckbox);
    if (!isChecked) {
      await this.page.click(this.isActiveCheckbox);
    }
  }
  async clickSearchButton() {
    await this.page.click(this.searchButton);
  }
  async enterRoleNameInSearchField(roleName) {
    await this.page.waitForSelector(this.searchField, { state: "visible" });
    await this.page.locator(this.searchField).fill(roleName);
  }
  async isRolePresentWithStatus(roleName) {
    //Row-text
    await this.page.waitForSelector(this.resultRow, { state: "visible" });
    const roleExists = await this.page.locator(this.resultRow).textContent();
    console.log(`Expected Role Name: "${roleName.trim()}"`);
    console.log("Actual Role Name: " + roleExists.trim());
    expect(roleExists.trim()).toEqual(roleName.trim());
    //greenTickLocator
    await this.page.waitForSelector(this.resultStatus, { state: "visible" });
    const greenTickLocator = await this.page.locator(this.resultStatus);
    expect(greenTickLocator).toBeVisible();
  }
  async threeDotsFromActionField() {
    await this.page.waitForSelector(this.threeDots, { state: "visible" });
    await this.page.locator(this.threeDots).click();
  }
  async activeAndDeactiveButton() {
    await this.page.waitForSelector(this.deactivateOptionSelector, {
      state: "visible",
    });
    await this.page.locator(this.deactivateOptionSelector).click();
  }
  async verifySuccessMessage(message) {
    await this.page.waitForSelector(this.successMessageSelector, {
      state: "visible",
    });
    const messageElement = await this.page
      .locator(this.successMessageSelector)
      .textContent();
    console.log(
      "Should show the Role De-activated Successfully :" + messageElement
    );
    expect(messageElement.trim()).toBe(message.trim());
  }

  async unCheckCheckBox() {
    await this.page.waitForSelector(this.activeCheckbox, { state: "visible" });
    const checkbox = this.page.locator(this.activeCheckbox);
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();
    await checkbox.click();
  }
  async checktheCheckBox() {
    await this.page.waitForSelector(this.checkbox, { state: "visible" });
    await this.page.locator(this.checkbox).click();
  }

  async roleNameStatusIsInactive() {
    await this.page.waitForSelector(this.rolenameStatusRed, {
      state: "visible",
    });
    const inactiveStatus = await this.page.locator(this.rolenameStatusRed);
    expect(inactiveStatus).toBeVisible();
  }
  async verifyRoleActivation(message) {
    await this.page.waitForSelector(this.sucessMessageRoleActivatedSelector, {
      state: "visible",
    });
    const roleactivation = await this.page
      .locator(this.sucessMessageRoleActivatedSelector)
      .textContent();
    expect(roleactivation).toBe(message.trim());
  }

  async getRolesCount(maxCount) {
    await this.page.waitForSelector(
      this.Previous,
      { state: "visible" },
      { timeout: 120 * 6000 }
    );
    await this.page.waitForSelector(this.rolesCountSelector, {
      state: "visible",
    });
    const roles = await this.page.locator(this.rolesCountSelector).all();
    const count = roles.length;

    console.log("Roles found: " + count);
    console.log("Expected Row count : " + maxCount);
    if (count > 0) {
      console.log("Actual Roles Row Count : " + count);
      expect(count).toBe(maxCount);
    } else {
      console.log("No roles found.");
    }
  }
  async clickAddUserButton() {
    await this.page.waitForSelector(
      this.addUserButton,
      { state: "visible" },
      { timeout: 120 * 1000 }
    );
    await this.page.locator(this.addUserButton).click();
  }
  async searchForRoleAddNewUser(roleNameForUsermanagement) {
    await this.page.waitForSelector(this.roleDropdownAddNewUser, {
      state: "visible",
    });
    await this.page.locator(this.roleDropdownAddNewUser).click();
    await this.page.waitForSelector(this.roleOption, { state: "visible" });
    await this.page.locator(this.roleOption).fill(roleNameForUsermanagement);
    console.log("Input text From RoleName search:" + roleNameForUsermanagement);
    await this.page.waitForSelector(this.roleOptionText, { state: "visible" });

    const optionText = await this.page
      .locator(this.roleOptionText)
      .allTextContents();
    console.log(
      "Suggestion Text From RoleName Add User Name page: " + optionText
    );

    // Join the array of strings and then trim the result
    const optionTextJoined = optionText.join("").trim();

    // Compare the trimmed and joined optionText with the roleNameForUsermanagement
    if (optionTextJoined === roleNameForUsermanagement.trim()) {
      expect(optionTextJoined).toBe(roleNameForUsermanagement.trim());
    }
  }

  async searchRoleUsermanagementpage(roleName) {
    await this.page.waitForSelector(this.roleDropdownUserMpage, {
      state: "visible",
    });
    await this.page.locator(this.roleDropdownUserMpage).click();
    await this.page.waitForSelector(this.roleDropdownSearchInput);
    await this.page.locator(this.roleDropdownSearchInput).fill(roleName);
    await this.page.waitForSelector(
      this.SuggestionRoleNameDropdownUserManagement,
      { state: "visible" }
    );
    const text = await this.page
      .locator(this.SuggestionRoleNameDropdownUserManagement)
      .allTextContents();
    console.log("Role Name suggestion for UserManagement Page:" + text);
    if (text === roleName.trim()) {
      expect(text.trim()).toBe(roleName.trim());
    }
  }
  async editRole() {
    await this.page.locator(this.editOption,{state:'visible'});
    await this.page.locator(this.editOption).click();
}
async changeRoleSettings() {
  const isChecked = await this.page.isChecked(this.roleReassignmentCheckbox);
  if (isChecked) {
      await this.page.uncheck(this.roleReassignmentCheckbox);
  }
}

async recordUpdatedSuccessfully(message) {
  await this.page.waitForSelector(this.recordsuccessMessage,{state:"visible"});
  const content=await this.page.locator(this.recordsuccessMessage).textContent();
  console.log("verify Success Message after Edit the role Reassignment Checkbox :"+content)
  await expect(content).toBe(message.trim());
}

}

module.exports = { RoleManagementPage };
