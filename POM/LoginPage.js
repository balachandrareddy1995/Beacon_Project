const { test, expect } = require('@playwright/test');
const { timeout } = require('../playwright.config');
const { title } = require('process');
class LoginPage {

  constructor(page) {
    this.page = page;
    this.usernameField = '//input[@placeholder="User Name"]';
    this.passwordField = '//input[@placeholder="Password"]';
    this.loginButtonSelector = '//button[text()="LOGIN"]';
    this.yes = '//span[text()="Yes"]';
  }

  async openUrl(url) {
    await this.page.goto(url);
    const gettitle=await this.page.title();
    console.log("Get URL Title : "+gettitle);
    const getUrl=await this.page.url();
    console.log("Get Login Url:"+getUrl);
  

    
  }

  async login(username, password) {
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButtonSelector);
  }

  async yesButton() {
    try{
   // Try to click the "yes" button using the locator
   await this.page.waitForSelector(this.yes,{state: 'visible' });
   await this.page.locator(this.yes).click();
   console.log("Yes button clicked successfully");

    }
    catch(error){
      // Handle any errors that occur in the try block
      console.log("Popup is not coming", error);
    } 
}
 async reEnterLogin(username,password){
  
  try {
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButtonSelector);
    console.log("Re-enter login is done");
  } 
  catch (error) {
    console.error("Landing as a Home Page", error);
  
 }
}
}

module.exports = { LoginPage };
