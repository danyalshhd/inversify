import { RunningAuctionResponse } from "./RunningAuction";

export type NormalizedResponse = {
    totalRunningAuctions: number;
    auctions: RunningAuctionResponse[];
    averageBidNumber: number;
    averageAuctionProgress: number;
};
