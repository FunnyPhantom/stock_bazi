const puppeteer = require("puppeteer");
const fs = require("fs");

const url = (namadUrlId) =>
  `http://www.tsetmc.com/Loader.aspx?ParTree=151311&i=${namadUrlId}`;

const sampleNamadUrlId = "14231831499205396";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url(sampleNamadUrlId));
  await page.evaluate(() => ii.ShowTab(17));
  await page.waitForSelector("#paging > div > a:nth-child(2)");
  const tbody = await page.$("#trade > div.objbox > table > tbody");
  const trs = await tbody.$eval("tr", (node) => node.children);
  console.log(trs);

  await page.screenshot({ path: "mamad.png" });
  await browser.close();
})();

function saveShit(html) {
  fs.writeFile("t.html", html, (e) => {
    console.log(e);
  });
}
