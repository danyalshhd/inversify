import { expect } from "chai";
import { mockRunningAuctionsResponse } from "../../../fixtures/mockData";
import { RunningAuctionResponse } from "../types/RunningAuction";
import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";

class CarOnSaleClientMock implements ICarOnSaleClient {
    private client = { token: "" };

    // tslint:disable-next-line: no-empty
    public constructor(token: string) {
        this.client.token = token;
    }
    getRunningAuctions(): Promise<RunningAuctionResponse[]> {
        if (!this.client.token) throw new Error("Not Authorized");
        return Promise.resolve(mockRunningAuctionsResponse);
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
            expect(error.message).to.equal("Not Authorized");
        }
    });
});
