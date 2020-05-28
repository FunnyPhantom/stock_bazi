import { model, Schema, Document } from "mongoose";

interface StockURLNameI extends Document {
  name: string;
  url: string;
}

const StockURLNameModel = model<StockURLNameI>(
  "url_namad",
  new Schema({ name: String, url: String })
);

export default StockURLNameModel;
