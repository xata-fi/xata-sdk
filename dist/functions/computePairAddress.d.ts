import { Token } from '../entities';
export declare const computePairAddress: ({ factoryAddress, tokenA, tokenB, isConveyorPair }: {
    factoryAddress: string;
    tokenA: Token;
    tokenB: Token;
    isConveyorPair: boolean;
}) => string;
