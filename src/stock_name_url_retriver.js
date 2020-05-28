import { launch } from "puppeteer";
import { connect } from "mongoose";
import { insertMany } from "./models/StockURLName.model";

const getStockData = async () => {
  const overwatchUrl = "http://www.tsetmc.com/loader.aspx?ParTree=15131F";
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(overwatchUrl);
  await page.waitForSelector(".\\{c\\}");
  await page.waitFor(1000);
  await page.screenshot({ path: "watch1.png" });

  const data = await page.evaluate(() => {
    const children = Array.from(document.querySelector("#main").children);
    const stockChildren = children.filter((ch) => ch.className !== "secSep");
    const data = stockChildren
      .map((stCh) => stCh.children[0].children[0])
      .map((lnk) => ({ name: lnk.innerText, url: lnk.target }));
    return data;
  });

  await browser.close();
  // console.log(data);

  return data;
};

const correctionForFarsiNames = (name) => {
  String.prototype.replaceAll = function (search, replacement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };

  String.prototype.toPersianCharacter = function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let string = this;
    const obj = {
      ك: "ک",
      دِ: "د",
      بِ: "ب",
      زِ: "ز",
      ذِ: "ذ",
      شِ: "ش",
      سِ: "س",
      ى: "ی",
      ي: "ی",
      "١": "۱",
      "٢": "۲",
      "٣": "۳",
      "٤": "۴",
      "٥": "۵",
      "٦": "۶",
      "٧": "۷",
      "٨": "۸",
      "٩": "۹",
      "٠": "۰",
    };

    Object.keys(obj).forEach(function (key) {
      string = string.replaceAll(key, obj[key]);
    });
    return string;
  };

  return name.toPersianCharacter();
};

const stockWithCorrectName = (v) => ({
  ...v,
  name: correctionForFarsiNames(v.name),
});

const saveToMongo = async () => {
  try {
    await connect("mongodb://localhost:27017/iran_stock_retriver");

    const result = await insertMany(
      (await getStockData()).map(stockWithCorrectName)
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await saveToMongo();
})();
