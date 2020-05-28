import StockUrlNameModel from "../models/StockURLName.model";
import { getTargetDaysForGettingDetail } from "../utils/functions";

const getStockDetailForDateRange = async (
  stockNamad: string,
  startDate: string,
  endDate: string,
  steps: string
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
  } catch (e) {
    console.log("error while kooft", e);
  }
};

export default getStockDetailForDateRange;
