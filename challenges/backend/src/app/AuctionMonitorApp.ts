import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { NormalizedResponse } from "./services/CarOnSaleClient/types/NormalizedResponse";

@injectable()
export class AuctionMonitorApp {
    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CARONSALE_CLIENT)
        private CarOnSaleClient: ICarOnSaleClient
    ) { }

    public async start(): Promise<void> {
        this.logger.log("Auction Monitor started.");

        const result: NormalizedResponse = {
            totalRunningAuctions: 0,
            auctions: [],
            averageBidNumber: 0,
            averageAuctionProgress: 0,
        };
        try {
            const response = await this.CarOnSaleClient.getRunningAuctions();
            if (response && response.length) {
                result.auctions = response;
                result.totalRunningAuctions = response.length;
                result.averageBidNumber =
                    response.reduce((acc, obj) => acc + (obj.numBids || 0), 0) / response.length;
                const totalHighestBidValue = response.reduce(
                    (acc, obj) => acc + (obj.currentHighestBidValue || 0), 0);
                const totalAskValue = response.reduce(
                    (acc, obj) => acc + (obj.minimumRequiredAsk || 0), 0);
                result.averageAuctionProgress = (totalHighestBidValue / totalAskValue) * 100;
            }
            this.logger.info(result);
            this.logger.log("End of Program, Exiting now!");
            process.exit(0);
        } catch (error: any) {
            let errorMessage = error.message;
            if (error.isAxiosError) {
                errorMessage = error?.response?.data?.message;
            }
            this.logger.error(errorMessage);
            process.exit(-1);
        }
    }
}
