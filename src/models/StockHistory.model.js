import { model, Schema } from "mongoose";

const StockHistoryModel = model(
  "StockHistory",
  Schema({
    namadName: String,
    data: [
      {
        date: Date,
        max: Number,
        min: Number,
        end: Number,
        lastDeal: Number,
        first: Number,
        yesterday: Number,
        value: Number,
        volume: Number,
        tradeCount: Number,
      },
    ],
  })
);

export default StockHistoryModel;
