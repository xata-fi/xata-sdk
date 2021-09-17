import { FACTORY_ADDRESS, CONVEYOR_V2_FACTORY_ADDRESS, INIT_CODE_HASH, LIQUIDITY_TOKEN_IDENTITY } from '../constants'
import { TokenType } from '../enums/Liquidity'
import { Exchanger } from '../enums/Exchanger'
import { ChainId } from '../enums'

/**
 * Determine the factory address of the selected exchanger
 * @param chainId
 * @param exchanger Default to Sushiswap
 * @returns Factory address
 */
export function factoryAddressOf(
  chainId: ChainId,
  exchanger: Exchanger = Exchanger.SUSHI,
  isProduction: boolean | undefined = undefined
): string {
  if (exchanger === Exchanger.SUSHI) {
    return FACTORY_ADDRESS[chainId]
  } else {
    let factory
    if (typeof isProduction !== 'undefined' && isProduction === true) {
      factory = CONVEYOR_V2_FACTORY_ADDRESS.production
    } else {
      factory = CONVEYOR_V2_FACTORY_ADDRESS.staging
    }

    return factory[chainId]
  }
}

/**
 * Determine the init code hash of the selected exchanger
 * @param exchanger Default to Sushiswap
 * @returns Init code hash
 */
export function initCodeHashOf(exchanger: Exchanger = Exchanger.SUSHI): string {
  return INIT_CODE_HASH[exchanger]
}

/**
 * Determine the token symbol and name of the selected liquidity pair type
 * @param type Default to Uniswap token
 * @returns [{token symbol}, {token name}]
 */
export function tokenIdentityOf(type: TokenType = TokenType.UNISWAP): string[] {
  return LIQUIDITY_TOKEN_IDENTITY[type]
}
