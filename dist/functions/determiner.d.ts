import { TokenType } from '../enums/Liquidity';
import { Exchanger } from '../enums/Exchanger';
import { ChainId } from '../enums';
/**
 * Determine the factory address of the selected exchanger
 * @param chainId
 * @param exchanger Default to Sushiswap
 * @returns Factory address
 */
export declare function factoryAddressOf(chainId: ChainId, exchanger?: Exchanger): string;
/**
 * Determine the init code hash of the selected exchanger
 * @param exchanger Default to Sushiswap
 * @returns Init code hash
 */
export declare function initCodeHashOf(exchanger?: Exchanger): string;
/**
 * Determine the token symbol and name of the selected liquidity pair type
 * @param type Default to Uniswap token
 * @returns [{token symbol}, {token name}]
 */
export declare function tokenIdentityOf(type?: TokenType): string[];
