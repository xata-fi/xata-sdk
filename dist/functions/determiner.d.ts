import { ChainId, Environment, Exchanger, TokenType } from '../enums';
/**
 * Determine the factory address of the selected exchanger
 * @param chainId
 * @param env Environment. Default to staging.
 * @returns Factory address
 */
export declare function factoryAddressOf(chainId: ChainId, env?: Environment): string;
/**
 * Determine the init code hash of the selected exchanger
 * @param exchanger Default to Sushiswap
 * @returns Init code hash
 * @deprecated
 */
export declare function initCodeHashOf(exchanger?: Exchanger): string;
/**
 * Determine the token symbol and name of the selected liquidity pair type
 * @param type Default to Uniswap token
 * @returns [{token symbol}, {token name}]
 * @deprecated
 */
export declare function tokenIdentityOf(type?: TokenType): string[];
