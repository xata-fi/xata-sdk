import { BigNumber, ethers, Signature } from 'ethers';
import * as eip712 from './lib/eip712';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Environment } from '../enums';
export default class Conveyor {
    chainId: number;
    geodeEndpoint: string;
    provider: JsonRpcProvider;
    feeToken: ethers.Contract;
    routerContract: ethers.Contract;
    factoryContract: ethers.Contract;
    init(provider: JsonRpcProvider, feeTokenAddr: string, env?: Environment): Promise<void>;
    _checkInit(): void;
    _pathExists(path: string[]): Promise<boolean>;
    _verifySignature(domain: eip712.TypedDomain, message: eip712.TypedForwarder, signature: Signature, signerAddress: string): boolean;
    setFeeToken(feeTokenAddr: string): void;
    sendRequest(args: Array<any>, method: string, gasLimit: BigNumber, gasPrice?: BigNumber): Promise<{
        errorMessage: string;
        success: boolean;
        txnHash: string;
    } | ethers.providers.TransactionResponse>;
    addLiquidity(tokenA: string, tokenB: string, amountADesired: BigNumber, amountBDesired: BigNumber, amountAMin: BigNumber, amountBMin: BigNumber, user: string, deadline: BigNumber, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<{
        errorMessage: string;
        success: boolean;
        txnHash: string;
    } | ethers.providers.TransactionResponse>;
    swapExactTokensForTokens(amountIn: BigNumber, amountOutMin: BigNumber, path: string[], user: string, deadline: BigNumber, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<{
        errorMessage: string;
        success: boolean;
        txnHash: string;
    } | ethers.providers.TransactionResponse>;
    removeLiquidity(tokenA: string, tokenB: string, liquidity: BigNumber, amountAMin: BigNumber, amountBMin: BigNumber, user: string, deadline: BigNumber, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<{
        errorMessage: string;
        success: boolean;
        txnHash: string;
    } | ethers.providers.TransactionResponse>;
}
