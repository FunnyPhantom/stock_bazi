const mongoose = require("mongoose");

const StockURLNameModel = mongoose.model(
  "url_namad",
  mongoose.Schema({ name: String, url: String })
);

module.exports = StockURLNameModel;
