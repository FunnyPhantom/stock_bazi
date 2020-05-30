import axios from "axios";
import { load } from "cheerio";
import { DayDetail } from "../types/types";

const detailUrl = (stockURL: string, day: string) =>
  `http://cdn.tsetmc.com/Loader.aspx?ParTree=15131P&i=${stockURL}&d=${day}`;

const InstrumentStateCodeToFarsi = {
  I: "ممنوع",
  A: "مجاز",
  S: "متوقف",
  R: "محفوظ",
};

const findTextAndReturnRemainder = (target: string, variable: string) => {
  const chopFront = target.substring(
    target.search(variable) + variable.length,
    target.length
  );
  const result = chopFront.substring(0, chopFront.search(";"));
  return result;
};

const getScriptTextFromUrl = async (url: string) => {
  const data = (await axios.get(url)).data;
  const $ = load(data);
  const sc = $("script");
  const arr = [];
  for (let i = 0; i < sc.length; i++) {
    arr[i] = sc[i];
  }
  const text = arr
    .map((el) => (el.children[0] ? el.children[0].data : ""))
    .reduce((prev, curr) => prev + " " + curr, "");

  return text;
};

const getVariableFromScriptText = (
  scriptText: string,
  variableName: string
) => {
  const dataString = findTextAndReturnRemainder(
    scriptText,
    `var ${variableName}=`
  );
  try {
    return eval(dataString);
  } catch (e) {
    console.error(
      "json could not be parsed.\n json=>",
      dataString.substring(0, 20),
      e
    );

    return undefined;
  }
};

const getDayDetail = async (stockURL: string, day: string) => {
  // const brw = await pup.launch();
  // const pg = await brw.newPage();
  // await pg.goto(detailUrl(stockURL, day), {
  //   timeout: 0,
  //   waitUntil: "networkidle0",
  // });

  const scText = await getScriptTextFromUrl(detailUrl(stockURL, day));
  console.log("page loaded");
  const allData = {
    StaticTreshholdData: getVariableFromScriptText(
      scText,
      "StaticTreshholdData"
    ), // [[0=?,1=?,2=?],[0=?, 1=maxThresh, 2=minThresh]]
    ClosingPriceData: getVariableFromScriptText(scText, "ClosingPriceData"), // [0=time, 1="-"?, 2=lastDeal, 3=end, 4=first, 5=yeserday,6=max, 7=min, 8=tradeCount, 9=volume ,10=value, 11="0", 12=timeString ]
    IntraDayPriceData: getVariableFromScriptText(scText, "IntraDayPriceData"), // data for candle chart
    InstrumentStateData: getVariableFromScriptText(
      scText,
      "InstrumentStateData"
    ), // [0=DayString, 1=timeString, 2=status]
    IntraTradeData: getVariableFromScriptText(scText, "IntraTradeData"), // [0=TradeNumber, 1=time, 2=volume, 3=price, 4=isDiclined]
    ShareHolderData: getVariableFromScriptText(scText, "ShareHolderData"), // [0=?, 1=Code, 2=Shares, 3=percentage, 4=""?,5="name"]
    ShareHolderDataYesterday: getVariableFromScriptText(
      scText,
      "ShareHolderDataYesterday"
    ), // [0=?, 1=Code, 2=Shares, 3=percentage, 4=""?,5="name"]
    ClientTypeData: getVariableFromScriptText(scText, "ClientTypeData"), // some shits
    BestLimitData: getVariableFromScriptText(scText, "BestLimitData"), // idk ?
  };

  return allData as DayDetail;
};

export default getDayDetail;
