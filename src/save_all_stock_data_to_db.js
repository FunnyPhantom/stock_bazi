import { find } from "./models/StockURLName.model";
import StockHistoryModel from "./models/StockHistory.model";
import { getStockData } from "./functions";
import mj from "moment-jalaali";

import { connect, disconnect } from "mongoose";



const parseDate = (dateNum) => {
  const d = mj(dateNum.toString(), "YYYYMMDD");
  return d.toDate();
};

const dataMatrixRowToDataModelObj = (row) => ({
  date: parseDate(row[0]),
  max: row[1],
  min: row[2],
  end: row[3],
  lastDeal: row[4],
  first: row[5],
  yesterday: row[6],
  value: row[7],
  volume: row[8],
  tradeCount: row[9],
});

const main = async () => {
  await connect("mongodb://localhost:27017/iran_stock_retriver", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("connected");

  const stocks = await find({});
  console.log("got Stocks");
  console.log(stocks);

  for (st of stocks) {
    const dataMatrix = await getStockData(st.url);
    console.log(`got stock data of ${st.name}`);
    const stockData = dataMatrix.map(dataMatrixRowToDataModelObj);
    const stockHistory = new StockHistoryModel({
      namadName: st.name,
      data: stockData,
    });
    await stockHistory.save();
    console.log(`saved stock data of ${st.name}`);
  }
  console.log("finished");
  await disconnect();
};




main();
