import StockUrlNameModel from "../models/StockURLName.model";
import { getTargetDaysForGettingDetail } from "../utils/functions";
import { parseSamplingInput } from "../utils/timeParse";
import getDayDetail from "./getDayDetail";
import {
  StockStatus,
  DayDetail,
  InstrumentStateCodeToFarsi,
  SampledStockDataRow,
} from "../types/types";
import mj from "moment-jalaali";

export const getFormattedDate = (day: string) =>
  mj(day, "YYYYMMDD").format("jYY.jMM.jDD");

export const getFormattedTime = (time: number) =>
  mj(time.toString().padStart(6, "0"), "HHmmss").format("HH:mm:ss");

const getVaziat = (
  samplT: number,
  instrumentStateData: DayDetail["InstrumentStateData"]
) => {
  const dd = instrumentStateData
    .map((v, i) => [Number.parseInt(v[1]), i])
    .filter((v) => v[0] >= samplT);
  let idx;
  if (dd.length === 0) idx = instrumentStateData.length - 1;
  else idx = dd[0][1] - 1;
  return instrumentStateData[idx][2];
};

const sampleDayData = (
  dayDetail: DayDetail,
  sampleTimes: number[],
  day: string
) => {
  const data: Array<SampledStockDataRow> = []; // 0 = day, 1 = time, 2=lastDeal, 3=lastPriceChange, 4=endPrice, 5=endPriceChange, 6=tradeAmount,7=tradeVolume, 8=tradeValue, 9=vaziat, 10=5sefaresh kharid, 11=5 sefaresh foroosh
  const formattedDate = getFormattedDate(day);
  const closePriceData = dayDetail.ClosingPriceData;

  sampleTimes.forEach((samplT) => {
    const biggers = closePriceData //todo: this definetly needs optimize
      .map((v, i) => [Number.parseInt(v[12]), i])
      .filter((v) => v[0] >= samplT);
    let idx;
    if (biggers.length === 0) idx = closePriceData.length - 1;
    else idx = biggers[0][1] - 1;
    const currentData = closePriceData[idx];
    const lastRowOfDataIdx = data.length - 1;
    const newRow = [];
    // day
    newRow.push(formattedDate);
    //time
    newRow.push(getFormattedTime(samplT));
    // lastPrice
    newRow.push(currentData[2]);
    // lastPriceChange
    if (lastRowOfDataIdx !== -1)
      newRow.push((currentData[2] / data[lastRowOfDataIdx][2] - 1) * 100);
    else newRow.push((currentData[2] / currentData[5] - 1) * 100);
    // endPrice
    newRow.push(currentData[3]);
    // endPriceChange
    if (lastRowOfDataIdx !== -1)
      newRow.push((currentData[3] / data[lastRowOfDataIdx][4] - 1) * 100);
    else newRow.push((currentData[3] / currentData[5] - 1) * 100);
    // tradeAmount
    newRow.push(currentData[8]);
    // tradeVolume
    newRow.push(currentData[9]);
    // tradeValue
    newRow.push(currentData[10]);
    // status
    newRow.push(
      InstrumentStateCodeToFarsi[
        getVaziat(samplT, dayDetail.InstrumentStateData)
      ]
    );

    //5 safe aval kharid,
    //add nashode
    // 5 safe avale froosh
    // add nashode

    data.push(newRow as SampledStockDataRow);
  });
  return data;
};

const getStockDetailForDateRange = async (
  stockNamad: string,
  startDate: string,
  endDate: string,
  samplings: string
) => {
  let stockUrl;
  try {
    stockUrl = (await StockUrlNameModel.findOne({ name: stockNamad })).url;
  } catch (e) {
    throw new Error("Name entered was not found");
  }
  try {
    const targetDays = await getTargetDaysForGettingDetail(
      stockUrl,
      startDate,
      endDate
    );
    const sampleTimes = parseSamplingInput(samplings);
    const allSampledData: Array<SampledStockDataRow> = [];
    for (const day of targetDays) {
      const dayDetail = await getDayDetail(stockUrl, day.toString());
      const sampledDayData = sampleDayData(
        dayDetail,
        sampleTimes,
        day.toString()
      );
      allSampledData.concat(sampledDayData);
    }
    return allSampledData;
  } catch (e) {
    console.log("error while kooft", e);
  }
};

export default getStockDetailForDateRange;
