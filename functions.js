const axios = require("axios");
const url =
  "http://members.tsetmc.com/tsev2/data/InstTradeHistory.aspx?i=14231831499205396&Top=999999&A=1";
const moment = require("moment-jalaali");

// (async () => {
//   try {
//     let data = "";
//     data = (await axios.get(url)).data;
//     const dataMatrix = parseMatrix(dataParser(data));
//     console.log(targetDays(dataMatrix, "1399/2/22", "1399/2/28"));
//   } catch (e) {
//     console.log("error");
//     console.log(e);
//   }
// })();

const dataParser = (dataString) =>
  dataString.split(";").map((row) => row.split("@"));

const parseMatrix = (dm) => {
  // dm[i][0] : dateString
  // dm[i][1] : maxPrice
  // dm[i][2] : minPrice
  // dm[i][3] : endPrice
  // dm[i][4] : lastDealPrice
  // dm[i][5] : firstPrice
  // dm[i][6] : yesterdayPrice
  // dm[i][7] : value
  // dm[i][8] : volume
  // dm[i][9] : count
  return dm.map(parseRow);
};

const parseRow = (row) => row.map(Number.parseFloat);

const getDate = (row) => row[0];

const jalaliDateToMiladiNumberDateParser = (jalaliDateString) => {
  const m = moment(jalaliDateString, "jYYYY/jM/jD");
  return Number.parseFloat(m.format("YYYYMMDD"));
};

const targetDays = (dataMatrix, startDateString, endDateString) =>
  dataMatrix.filter(
    (row) =>
      getDate(row) >= jalaliDateToMiladiNumberDateParser(startDateString) &&
      getDate(row) <= jalaliDateToMiladiNumberDateParser(endDateString)
  );

const parseTimeStamp = (timeStampString) => {
  let trimmed = "";
  trimmed = timeStampString.trim();
  trimmed = trimmed.substring(1, trimmed.length - 1);
  let tokens = trimmed.split(",");
  if (tokens.length === 1) return tokens.map(parseTime);
  else
    return generateTimes(
      parseTime(tokens[0]),
      parseTime(tokens[1]),
      parseStep(tokens[2])
    );
};

const parseTime = (timeString) =>
  timeString
    .split(":")
    .map((str) => Number.parseInt(str))
    .reduce((prev, curr, i) =>
      i === 0 ? prev + curr * 60 * 60 : i === 1 ? prev + curr * 60 : prev + curr
    );

const parseStep = (stepString) => {
  const mp = {
    h: 60 * 60,
    m: 60,
    s: 1,
  };
  const step = Number.parseInt(
    stepString.substring(0, stepString.length` - 1`)
  );
  return step * mp[stepString[length - 1]];
};

const generateTimes = (start, end, step) => {
  const times = [];
  let t = start;
  do {
    times.push(t);
    t += step;
  } while (t <= end);
  return times;
};

const parseTimeStampArr = (timeStampArrString = "") => {
  let trimmed = timeStampArrString.trim();
  trimmed = trimmed.substring(1, trimmed.length - 1);
  return trimmed
    .split(",")
    .map(parseTimeStamp)
    .reduce((arr1, arr2) => [...arr1, ...arr2], [])
    .sort();
};
