import { expect } from "chai";
import { mockRunningAuctionsResponse } from "../../../fixtures/mockData";
import { RunningAuctionResponse } from "../../CarOnSaleClient/types/RunningAuction";
import { Logger } from "../../Logger/classes/Logger";
import { IAuthentication } from "../interface/IAuthentication";
import { CarOnSaleClient } from "../../CarOnSaleClient/classes/CarOnSaleClient";
import { APIClient } from "../../APIClient/classes/APIClient";

class AuthenticationMock implements IAuthentication {
    private userid = "fakeID";
    private password = "fakePassword";
    private client = { token: "" };

    // tslint:disable-next-line: no-empty
    public constructor() { }
    userId!: string;
    token!: string;

    public async authenticateUser(userId = this.userid, password = this.password) {
        if (userId === "fakeID" && password === "fakePassword") {
            this.client.token = "fake-token";
        } else {
            throw new Error(`Authentisierung für Benutzer "${this.userid}" fehlgeschlagen.`);
        }
    }

    public async retrieveRunningAuctions(): Promise<RunningAuctionResponse[]> {
        if (!this.client.token) throw new Error("Not Authorized");
        return Promise.resolve(mockRunningAuctionsResponse);
    }
}

describe("Authentication Test", () => {

    it("should fail to authenticate coz userId is wrong", async () => {
        const authMock = new AuthenticationMock();
        try {
            await authMock.authenticateUser("realUSer", "fakePassword");
        } catch (error: any) {
            expect(error.message).to.equal(
                'Authentisierung für Benutzer "fakeID" fehlgeschlagen.'
            );
        }
    });

    it("should fail to authenticate coz password is wrong", async () => {
        const logger = new Logger();
        const apiClient = new APIClient("https://api-core-dev.caronsale.de/ap")
        const authMock = new AuthenticationMock();
        const client = new CarOnSaleClient(logger, apiClient, authMock);
        try {
            await client.getRunningAuctions();
        } catch (error: any) {
            expect(error.message).to.equal("Not authorized");
        }
    });
});
