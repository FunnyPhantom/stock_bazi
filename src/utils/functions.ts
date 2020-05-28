import axios from "axios";
import moment from "moment-jalaali";
const url =
  "http://members.tsetmc.com/tsev2/data/InstTradeHistory.aspx?i=14231831499205396&Top=999999&A=1";

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

const dataParser = (dataString: string) =>
  dataString.split(";").map((row) => row.split("@"));

const parseRow = (row: string[]) => row.map(Number.parseFloat);

const parseMatrix = (dm: string[][]) => {
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

const getDate = (row: number[]) => row[0];

export const jalaliDateToMiladiNumberDateParser = (
  jalaliDateString: string
) => {
  const m = moment(jalaliDateString, "jYYYY/jM/jD");
  return Number.parseFloat(m.format("YYYYMMDD"));
};

const targetDays = (
  dataMatrix: number[][],
  startDateString: string,
  endDateString: string
) =>
  dataMatrix.filter(
    (row) =>
      getDate(row) >= jalaliDateToMiladiNumberDateParser(startDateString) &&
      getDate(row) <= jalaliDateToMiladiNumberDateParser(endDateString)
  );

// const parseTime = (timeString: string) =>
//   timeString
//     .split(":")
//     .map((str) => Number.parseInt(str))
//     .reduce((prev, curr, i) =>
//       i === 0 ? prev + curr * 60 * 60 : i === 1 ? prev + curr * 60 : prev + curr
//     );

// const generateTimes = (start: number, end: number, step: number) => {
//   const times = [];
//   let t = start;
//   do {
//     times.push(t);
//     t += step;
//   } while (t <= end);
//   return times;
// };

// const parseStep = (stepString: string) => {
//   const mp = {
//     h: 60 * 60,
//     m: 60,
//     s: 1,
//   };
//   const step = Number.parseInt(stepString.substring(0, stepString.length - 1));
//   return step * mp[stepString[length - 1] as "h" | "m" | "s"];
// };

// const parseTimeStamp = (timeStampString: string) => {
//   let trimmed = "";
//   trimmed = timeStampString.trim();
//   trimmed = trimmed.substring(1, trimmed.length - 1);
//   const tokens = trimmed.split(",");
//   if (tokens.length === 1) return tokens.map(parseTime);
//   else
//     return generateTimes(
//       parseTime(tokens[0]),
//       parseTime(tokens[1]),
//       parseStep(tokens[2])
//     );
// };

// const parseTimeStampArr = (timeStampArrString: string) => {
//   let trimmed = timeStampArrString.trim();
//   trimmed = trimmed.substring(1, trimmed.length - 1);
//   return trimmed
//     .split(",")
//     .map(parseTimeStamp)
//     .reduce((arr1, arr2) => [...arr1, ...arr2], [])
//     .sort();
// };

const getStockData = async (urlId: string) => {
  const url = (urlId: string | number) =>
    `http://members.tsetmc.com/tsev2/data/InstTradeHistory.aspx?i=${urlId}&Top=999999&A=1`;
  const rawData = (await axios.get(url(urlId))).data;
  return dataParser(rawData);
};

export const getTargetDaysForGettingDetail = async (
  stockURL: string,
  startDate: string,
  endDate: string
) => {
  const data = parseMatrix(await getStockData(stockURL));
  const tDays = targetDays(data, startDate, endDate);
  return tDays.map(getDate);
};

export default getStockData;
