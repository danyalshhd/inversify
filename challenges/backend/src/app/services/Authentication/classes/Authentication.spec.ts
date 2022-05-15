import { expect } from "chai";
import { mockRunningAuctionResponse } from "../../../helpers/mockData";
import { RunningAuctionResponse } from "../../CarOnSaleClient/types/RunningAuction";
import { Logger } from "../../Logger/classes/Logger";
import { IAuthentication } from "../interface/IAuthentication";
import { CarOnSaleClient } from "../../CarOnSaleClient/classes/CarOnSaleClient";
import { APIClient } from "../../APIClient/classes/APIClient";

class AuthenticationMock implements IAuthentication {
    private userid = "demoID";
    private password = "demoPassword";
    private client = { token: "" };

    // tslint:disable-next-line: no-empty
    public constructor() { }
    userId!: string;
    token!: string;

    public async authenticateUser(userId = this.userid, password = this.password) {
        if (userId === "demoID" && password === "demoPassword") {
            this.client.token = "fake-token";
        } else {
            throw new Error(`Authentisierung für Benutzer "${this.userid}" fehlgeschlagen.`);
        }
    }

    public async retrieveRunningAuctions(): Promise<RunningAuctionResponse[]> {
        if (!this.client.token) throw new Error("Please authenticate user first!");
        return Promise.resolve(mockRunningAuctionResponse);
    }
}

describe("Authentication Test", () => {

    it("should fail to authenticate as userId is incorrect", async () => {
        const authMock = new AuthenticationMock();
        try {
            await authMock.authenticateUser("realUSer", "demoPassword");
        } catch (error: any) {
            expect(error.message).to.equal(
                'Authentisierung für Benutzer "demoID" fehlgeschlagen.'
            );
        }
    });

    it("should fail to authenticate as password is incorrect", async () => {
        const logger = new Logger();
        const apiClient = new APIClient('https://api-core-dev.caronsale.de/ap')
        const authMock = new AuthenticationMock();
        const client = new CarOnSaleClient(logger, apiClient, authMock);
        try {
            await client.getRunningAuctions();
        } catch (error: any) {
            expect(error.message).to.equal('Please authenticate user first!');
        }
    });
});
