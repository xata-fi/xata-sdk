import { BigNumber, Signature } from 'ethers';
export declare const DomainType: {
    name: string;
    type: string;
}[];
export declare const PermitType: {
    name: string;
    type: string;
}[];
export declare const ForwarderType: {
    name: string;
    type: string;
}[];
export declare function hashAddLiquidityPayload(tokenA: string, tokenB: string, amountADesired: BigNumber, amountBDesired: BigNumber, amountAMin: BigNumber, amountBMin: BigNumber, user: string, deadline: BigNumber): string;
export declare function hashSwapPayload(amount0: BigNumber, amount1: BigNumber, path: string[], user: string, deadline: BigNumber): string;
export declare function hashRemoveLiquidityPayload(tokenA: string, tokenB: string, liquidity: BigNumber, amountAMin: BigNumber, amountBMin: BigNumber, user: string, deadline: BigNumber, sig: Signature): string;
export interface TypedDomain {
    name: string;
    version: string;
    chainId: string;
    verifyingContract: string;
}
export interface TypedForwarder {
    from: string;
    feeToken: string;
    maxTokenAmount: string;
    deadline: string;
    nonce: string;
    data: string;
    hashedPayload: string;
}
export declare function getDomain(contractAddress: string, chain_id: number, domain_name: string): TypedDomain;
export declare function buildMessage(args: Array<any>, method: string, feeToken: string, maxTokenAmount: BigNumber, nonce: BigNumber): TypedForwarder;
