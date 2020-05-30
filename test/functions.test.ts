import { getFormattedDate } from "../src/services/getStockDetailForDateRange";

import { expect } from "chai";

describe("getFormattedDate works correctyly", () => {
  it("should give rightresult for stuff", () => {
    expect(getFormattedDate("20200530")).to.equal("99.03.10");
  });
});
