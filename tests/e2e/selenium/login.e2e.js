const { Builder, By, until } = require("selenium-webdriver");

(async function loginE2E() {
  //Chrome
  const driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("http://localhost:3000/");

    await driver.findElement(By.id("email")).sendKeys("admin@test.com");
    await driver.findElement(By.id("password")).sendKeys("password");

    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes("/dashboard"),
      5000
    );

    console.log("bravo !");
  } catch (err) {
    console.error("zut:", err);
  } finally {
    await driver.quit();
  }
})();