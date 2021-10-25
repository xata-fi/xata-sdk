import { BigNumber } from "@ethersproject/bignumber";
import { ChainId } from '../../enums';
export declare const PRICE_API_PREFIX: {
    [chainId in ChainId]?: string;
};
/**
 * This function converts a transaction fee to the equivalent value of the provided payment token
 * @param chainId the chainID of the network
 * @param token the payment token
 * @param tokenDecimals the decimals of the token
 * @param gasFee the transaction fee
 * @param nativeToken the native token of the network. 'eth', 'bsc' etc
 * @param nativeTokenDecimals defaults at 18
 * @return the total amount of tokens to be paid for the transaction fee
 */
export declare function calculateFee(chainId: ChainId, token: string, tokenDecimals: number, gasFee: BigNumber, nativeToken: string, nativeTokenDecimals?: number): Promise<BigNumber>;
/**
 * Same as the calculateFee() method but used exclusively for calculating token fees on the Matic network
 * @param token the payment token
 * @param tokenDecimals the decimals of the token
 * @param gasFee the transaction fee
 * @returns the total amount of tokens to be paid for the transaction fee
 */
export declare function calculateFeeOnMatic(token: string, tokenDecimals: number, gasFee: BigNumber): Promise<BigNumber>;
