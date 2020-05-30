export type StockStatus = "A" | "I" | "S" | "R" | "IS" | "IR" | "AR";

export const InstrumentStateCodeToFarsi: {
  [k in StockStatus]: string;
} = {
  I: "ممنوع",
  A: "مجاز",
  S: "متوقف",
  R: "محفوظ",
  AR: "مجاز-محفوظ",
  IR: "ممنوع-محفوظ",
  IS: "ممنوع-متوقف",
};

export interface DayDetail {
  /**
   * // [[0=?,1=?,2=?],[0=?, 1=maxThresh, 2=minThresh]]
   */
  StaticTreshholdData: [
    [
      number, // ?
      number, // ?
      number // ?
    ],
    [
      number, // ?
      number, // maxThreshold
      number // minThreshold
    ]
  ]; //[[0=?,1=?,2=?],[0=?, 1=maxThresh, 2=minThresh]]
  /**
   * [0=time, 1="-"?, 2=lastDeal, 3=end, 4=first, 5=yeserday,6=max, 7=min, 8=tradeCount, 9=volume ,10=value, 11="0", 12=timeString ]
   */
  ClosingPriceData: Array<
    [
      string, //time
      "-", // ?
      number, //lastDeal
      number, //end
      number, //first
      number, //yeserday
      number, //max
      number, //min
      number, //tradeCount
      number, //volume
      number, // value
      "0", //?
      string //timeString
    ]
  >;
  IntraDayPriceData: any; // data for candle chart
  /** [0=DayString, 1=timeString, 2=status] */
  InstrumentStateData: Array<
    [
      string, // dayString
      string, //timeString
      StockStatus //status
    ]
  >;
  /**
   * [0=TradeNumber, 1=time, 2=volume, 3=price, 4=isDiclined]
   */
  IntraTradeData: Array<
    [
      number, // TradeNumber
      number, // time
      number, // volume
      number, // price
      0 | 1 // 0=passed, 1=declined
    ]
  >;
  /**
   * [0=?, 1=Code, 2=Shares, 3=percentage, 4=""?,5="name"]
   */
  ShareHolderData: Array<
    [
      number, // ?
      string, // company code
      number, // shares
      number, // percentage
      "", // ?
      string //company name
    ]
  >;
  /**
   * [0=?, 1=Code, 2=Shares, 3=percentage, 4=""?,5="name"]
   */
  ShareHolderDataYesterday: Array<
    [
      number, // ?
      string, // company code
      number, // shares
      number, // percentage
      "", // ?
      string //company name
    ]
  >;
  ClientTypeData: any; // some shits
  BestLimitData: any; // idk ?
}

export type SampledStockDataRow = [
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  string,
  string?,
  string?
];
