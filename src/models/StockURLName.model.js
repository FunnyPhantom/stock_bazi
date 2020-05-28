import { model, Schema } from "mongoose";

const StockURLNameModel = model(
  "url_namad",
  Schema({ name: String, url: String })
);

export default StockURLNameModel;
