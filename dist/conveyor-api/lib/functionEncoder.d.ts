import { BigNumber, Signature } from 'ethers';
export declare function encodeAddLiquidity(tokenA: string, tokenB: string, amountADesired: BigNumber, amountBDesired: BigNumber, amountAMin: BigNumber, amountBMin: BigNumber, user: string, deadline: BigNumber): string;
export declare function encodeSwapExactTokensForTokens(amountIn: BigNumber, amountOutMin: BigNumber, path: string[], user: string, deadline: BigNumber): string;
export declare function encodeSwapTokensForExactTokens(amountOut: BigNumber, amountInMax: BigNumber, path: string[], user: string, deadline: BigNumber): string;
export declare function encodeRemoveLiquidityWithPermit(tokenA: string, tokenB: string, liquidity: BigNumber, amountAMin: BigNumber, amountBMin: BigNumber, user: string, deadline: BigNumber, sig_obj: Signature): string;
