import StHM from "../models/StockHistory.model";
import mon from "mongoose";

const main = async () => {
  await mon.connect("mongodb://localhost:27017/iran_stock_retriver", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("connected");

  const sum = (a, b) => a + b;

  const aggregateTradeCountForEachStock = await StHM.mapReduce({
    map: function () {
      const toTradeCount = (tradeData) => tradeData.tradeCount || 0;
      const sum = (a, b) => a + b;
      emit(this.namadName, this.data.map(toTradeCount).reduce(sum));
    },
  });

  const allTradeCounts = aggregateTradeCountForEachStock.results
    .map((r) => r.value)
    .reduce(sum);

  console.log("allTrades in Iran StockMarket from sale 80:", allTradeCounts);

  // console.log(sample);
  // console.log(typeof sample[0]);
  // console.log(
  //   sample.reduce((p, c, i) => {
  //     console.log(`i=${i},p=${p},c=${c}`);
  //     return p + c;
  //   }, 0)
  // );
  // console.log(sample.findIndex((v) => Number.isNaN(v)));

  // // console.log(sths);

  await mon.disconnect();
};

main();
