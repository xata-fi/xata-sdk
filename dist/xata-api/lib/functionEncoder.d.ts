import { BigNumber, Signature } from 'ethers';
export declare function encodeAddLiquidity(_tokenA: string, _tokenB: string, _amountADesired: BigNumber, _amountBDesired: BigNumber, _amountAMin: BigNumber, _amountBMin: BigNumber, _user: string, _deadline: BigNumber): string;
export declare function encodeSwapExactTokensForTokens(_amountIn: BigNumber, _amountOutMin: BigNumber, _path: string[], _user: string, _deadline: BigNumber): string;
export declare function encodeSwapTokensForExactTokens(_amountOut: BigNumber, _amountInMax: BigNumber, _path: string[], _user: string, _deadline: BigNumber): string;
export declare function encodeRemoveLiquidityWithPermit(_tokenA: string, _tokenB: string, _liquidity: BigNumber, _amountAMin: BigNumber, _amountBMin: BigNumber, _user: string, _deadline: BigNumber, _sig_obj: Signature): string;
