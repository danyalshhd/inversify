import { expect } from "chai";
import { mockRunningAuctionResponse } from "../../../helpers/mockData";
import { RunningAuctionResponse } from "../types/RunningAuction";
import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";

class CarOnSaleClientMock implements ICarOnSaleClient {
    private client = { token: "" };

    // tslint:disable-next-line: no-empty
    public constructor(token: string) {
        this.client.token = token;
    }
    getRunningAuctions(): Promise<RunningAuctionResponse[]> {
        if (!this.client.token) throw new Error("Please authenticate user first!");
        return Promise.resolve(mockRunningAuctionResponse);
    }
}

describe("CarOnSaleClient Test", () => {
    it("should return a list of running auctions", async () => {
        const client = new CarOnSaleClientMock("abc");

        const response = await client.getRunningAuctions();
        expect(response).to.be.an("array");
        expect(response[0]).to.be.an("object");
        expect(response.length).to.equal(4);
    });

    it("should fail to retrieve Running auctions as user is not yet authenticated", async () => {
        const client = new CarOnSaleClientMock("");
        try {
            await client.getRunningAuctions();
        } catch (error: any) {
            expect(error.message).to.equal("Please authenticate user first!");
        }
    });
});
