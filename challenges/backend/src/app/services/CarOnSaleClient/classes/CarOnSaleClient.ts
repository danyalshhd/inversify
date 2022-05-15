import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { inject, injectable } from "inversify";
import { DependencyIdentifier } from "../../../DependencyIdentifiers";
import { ILogger } from "../../Logger/interface/ILogger";
import { IAPIClient } from "../../APIClient/interface/IAPIClient";
import { IAuthentication } from "../../Authentication/interface/IAuthentication";
import { AxiosResponse } from "axios";
import { RunningAuctionResponse } from "../types/RunningAuction";
import { NotAuthorizedError } from "@dstransaction/common";
@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {
    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.API_CLIENT) private apiClient: IAPIClient,
        @inject(DependencyIdentifier.AUTHENTICATION) private auth: IAuthentication
    ) { }

    public async getRunningAuctions() {
        try {
            await this.auth.authenticateUser();
            return this.retrieveRunningAuctions();
        } catch (error: any) {
            let errorMessage = error.message;
            if (error.isAxiosError) {
                errorMessage = error?.response?.data?.message;
            }
            this.logger.error(errorMessage);
            throw error;
        }
    }

    private async retrieveRunningAuctions() {
        if (!this.auth.token) {
            throw new NotAuthorizedError();
        }

        this.apiClient.instance.defaults.headers.authtoken = this.auth.token;
        this.apiClient.instance.defaults.headers.userId = this.auth.userId;
        const url = `/v1/auction/salesman/${this.auth.userId}/_all/bidding-data`;
        const response: AxiosResponse<RunningAuctionResponse[]> = await this.apiClient.instance.get(url);
        return response.data;
    }
}
