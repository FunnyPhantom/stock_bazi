import getDayDetail from "./services/getDayDetail";

const main = async () => {
  const sampleURLId = "14231831499205396";
  const sampleDay = "20200523";

  const data = await getDayDetail(sampleURLId, sampleDay);
  const size = JSON.stringify({
    ClosingPriceData: data.ClosingPriceData,
    IntraTradeData: data.IntraTradeData,
  }).length;
  console.log(size);
  console.log(data.IntraTradeData.length);
  console.log(size / data.IntraTradeData.length);
};

main();
