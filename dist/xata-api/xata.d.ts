import { BigNumber, ethers, Signature } from 'ethers';
import * as eip712 from './lib/eip712';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Environment } from '../enums';
import { SignatureLike } from '@ethersproject/bytes';
interface Response {
    id: number;
    jsonrpc: string;
    result: {
        errorMessage: string;
        success: boolean;
        txnHash: string;
    };
}
export default class Xata {
    chainId: number;
    geodeEndpoint: string;
    provider?: JsonRpcProvider;
    feeToken?: ethers.Contract;
    routerContract?: ethers.Contract;
    factoryContract?: ethers.Contract;
    init(provider: JsonRpcProvider, feeTokenAddr: string, env?: Environment): Promise<void>;
    _checkInit(): void;
    _pathExists(path: string[]): Promise<boolean>;
    _verifySignature(domain: eip712.TypedDomain, message: eip712.TypedForwarder, signature: Signature, signerAddress: string): boolean;
    setFeeToken(feeTokenAddr: string): void;
    sendRequest(args: Array<any>, method: string, gasLimit: BigNumber, gasPrice?: BigNumber): Promise<Response>;
    addLiquidity(_tokenA: string, _tokenB: string, _amountADesired: BigNumber, _amountBDesired: BigNumber, _amountAMin: BigNumber, _amountBMin: BigNumber, _user: string, _deadline: BigNumber, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<Response>;
    swapExactTokensForTokens(_amountIn: BigNumber, _amountOutMin: BigNumber, _path: string[], _user: string, _deadline: BigNumber, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<Response>;
    swapTokensForExactTokens(_amountOut: BigNumber, _amountInMax: BigNumber, _path: string[], _user: string, _deadline: BigNumber, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<Response>;
    permitLP(_pairAddr: string, _owner: string, _spender: string, _value: BigNumber, _nonce: BigNumber, _deadline: BigNumber): Promise<SignatureLike>;
    removeLiquidity(_tokenA: string, _tokenB: string, _liquidity: BigNumber, _amountAMin: BigNumber, _amountBMin: BigNumber, _user: string, _deadline: BigNumber, _sig: SignatureLike, gasLimit?: BigNumber, gasPrice?: BigNumber): Promise<Response>;
}
export {};
