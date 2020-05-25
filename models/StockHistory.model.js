const mongoose = require("mongoose");

const StockHistoryModel = mongoose.model(
  "StockHistory",
  mongoose.Schema({
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

module.exports = StockHistoryModel;
