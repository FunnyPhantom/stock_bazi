import { model, Schema, Document } from "mongoose";

const StockHistorySchema = new Schema({
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
});

interface DayHistoryData {
  date: Date;
  max: number;
  min: number;
  end: number;
  lastDeal: number;
  first: number;
  yesterday: number;
  value: number;
  volume: number;
  tradeCount: number;
}

interface StockHistoryI extends Document {
  namadName: string;
  data: Array<DayHistoryData>;
}

const StockHistoryModel = model<StockHistoryI>(
  "StockHistory",
  StockHistorySchema
);

export default StockHistoryModel;
