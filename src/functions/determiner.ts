import { FACTORY_ADDRESS, INIT_CODE_HASH, LIQUIDITY_TOKEN_IDENTITY } from '../constants'
import { ChainId, Environment, Exchanger, TokenType } from '../enums'

/**
 * Determine the factory address of the selected exchanger
 * @param chainId
 * @param env Environment. Default to staging.
 * @returns Factory address
 */
export function factoryAddressOf(chainId: ChainId, env: Environment = Environment.STAGING): string {
  return FACTORY_ADDRESS[env][chainId]
}

/**
 * Determine the init code hash of the selected exchanger
 * @param exchanger Default to Sushiswap
 * @returns Init code hash
 * @deprecated
 */
export function initCodeHashOf(exchanger: Exchanger = Exchanger.SUSHI): string {
  return INIT_CODE_HASH[exchanger]
}

/**
 * Determine the token symbol and name of the selected liquidity pair type
 * @param type Default to Uniswap token
 * @returns [{token symbol}, {token name}]
 * @deprecated
 */
export function tokenIdentityOf(type: TokenType = TokenType.UNISWAP): string[] {
  return LIQUIDITY_TOKEN_IDENTITY[type]
}
