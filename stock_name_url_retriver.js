const pup = require("puppeteer");
const mongoose = require("mongoose");
const StockURLNameModel = require("./models/StockURLName.model");

const getStockData = async () => {
  const overwatch_url = "http://www.tsetmc.com/loader.aspx?ParTree=15131F";
  const browser = await pup.launch();
  const page = await browser.newPage();
  await page.goto(overwatch_url);
  await page.waitForSelector(".\\{c\\}");
  await page.waitFor(1000);
  await page.screenshot({ path: "watch1.png" });

  const data = await page.evaluate(() => {
    const children = Array.from(document.querySelector("#main").children);
    const stockChildren = children.filter((ch) => ch.className !== "secSep");
    let data = stockChildren
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
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
  };

  String.prototype.toPersianCharacter = function () {
    var string = this;
    var obj = {
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

const save_to_mongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/iran_stock_retriver");

    const result = await StockURLNameModel.insertMany(
      (await getStockData()).map(stockWithCorrectName)
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await save_to_mongo();
})();
