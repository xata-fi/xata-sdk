import { Token } from '../entities';
export declare const computePairAddress: ({ factoryAddress, tokenA, tokenB, isXataPair }: {
    factoryAddress: string;
    tokenA: Token;
    tokenB: Token;
    isXataPair: boolean;
}) => string;
