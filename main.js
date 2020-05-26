const getDayDetail = require("./services/getDayDetail");

const main = async () => {
  const sampleURLId = "14231831499205396";
  const sampleDay = "20200523";

  const data = await getDayDetail(sampleURLId, sampleDay);
  console.log(Object.keys(data));
};

main();
