/**
 * For the fear of using <any>, some of the field are inferred "casually" from the variable name
 */
export type RunningAuctionResponse = {
    uuid: string;
    state: number;
    endingTime: string;
    remainingTimeInSeconds: number;
    remainingTimeForInstantPurchaseInSeconds: number | null;
    instantPurchasePossibleUntil: number | string | null;
    _fk_uuid_highestBiddingBuyerUser: string | null;
    currentHighestBidValue: number;
    currentHighestBidValueNet: number | null;
    minimumRequiredAsk: number;
    minimumRequiredAskNet: number;
    numBids: number;
    amIHighestBidder: boolean;
    biddingAgentValue: number | null;
    isMinAskReached: boolean;
    isCrossBorderNetSale: boolean;
};
