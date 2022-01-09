import { BigNumber } from '@ethersproject/bignumber'
import { BigNumber as JSBigNumber } from 'bignumber.js'
import { ChainId, Environment } from '../../enums'

export const BASE_URL: { [env in Environment]: string } = {
  [Environment.STAGING]: 'https://8e9e-2406-da18-c6c-300-d339-7160-2052-7937.ngrok.io/price',
  [Environment.PRODUCTION]: 'https://xata-coingecko.automata.team/price'
}

const NETWORK_ID: { [chainId in ChainId]?: string } = {
  [ChainId.BSC]: 'binance-smart-chain',
  [ChainId.MATIC]: 'polygon-pos',
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.ARBITRUM]: 'arbitrum-one',
  [ChainId.MOONRIVER]: 'moonriver'
}

const COIN_ID: { [chainId in ChainId]?: string } = {
  [ChainId.MATIC]: 'matic-network',
  [ChainId.MOONRIVER]: 'moonriver'
}

// export const PRICE_API_PREFIX: { [chainId in ChainId]?: string } = {
//   [ChainId.BSC]: 'https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?',
//   [ChainId.MATIC]: 'https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?',
//   [ChainId.MAINNET]: 'https://api.coingecko.com/api/v3/simple/token_price/ethereum?',
//   [ChainId.ARBITRUM]: 'https://api.coingecko.com/api/v3/simple/token_price/arbitrum-one?',
//   [ChainId.MOONRIVER]: 'https://api.coingecko.com/api/v3/simple/token_price/moonriver?'
// }

// type Price = {
//   [tokenAddress: string]: {
//     [baseSymbol: string]: number
//   }
// }

type PriceQueryString = {
  tokens: string
  base: string
}

/**
 * Get the endpoint of Price API based on supplied params
 * @param host
 * @param network
 * @param query
 */
function getPriceApiUrl(host: string, network: string, query: PriceQueryString): string {
  const { tokens, base } = query
  return `${host}?network=${network}&tokens=${tokens}&base=${base}`
}

/**
 * Fetch price API and return the result
 * @param chainId The chain id of the network.
 * @param tokens The token address(es) to check.
 * @param base Crypto token or world currency symbol which will be used to compare the tokens price. Default is usd.
 * @param env Deployment environment of the app. Default is production.
 * @return Price API promise
 */
async function fetchPrice(
  chainId: ChainId,
  tokens: string | string[],
  base: string = 'usd',
  env: Environment = Environment.PRODUCTION
) {
  const network = NETWORK_ID[chainId]
  if (!network) {
    throw new Error(`Error: API support for the provided chainId ${chainId} is not supported`)
  }

  const host = BASE_URL[env]
  const query: PriceQueryString = {
    tokens: Array.isArray(tokens) ? encodeURIComponent(tokens.join(',')) : tokens,
    base
  }

  return fetch(getPriceApiUrl(host, network, query))
}

/**
 * This function converts a transaction fee to the equivalent value of the provided payment token
 * @param chainId the chainID of the network
 * @param token the payment token
 * @param tokenDecimals the decimals of the token
 * @param gasFee the transaction fee
 * @param nativeToken the native token of the network. 'eth', 'bsc' etc
 * @param nativeTokenDecimals defaults at 18
 * @param env Deployment environment of the app. Default is production
 * @return the total amount of tokens to be paid for the transaction fee
 */
export async function calculateFee(
  chainId: ChainId,
  token: string,
  tokenDecimals: BigNumber,
  gasFee: BigNumber,
  nativeToken: string,
  nativeTokenDecimals = 18,
  env: Environment = Environment.PRODUCTION
): Promise<BigNumber> {
  const response = await fetchPrice(chainId, token, nativeToken, env)
  const data: Promise<any> = response.json().then(res => {
    if (Object.keys(res).length === 0) {
      throw new Error('Error: Unsupported fee token.')
    }
    return Object.values(res)[0]
  })

  let ethPerToken: number
  if (nativeToken === 'eth') {
    const { eth } = await data
    ethPerToken = eth
  } else if (nativeToken === 'bnb') {
    const { bnb } = await data
    ethPerToken = bnb
  } else {
    throw new Error('Error: Unsupported native token. Try using the calculateFeeThenConvert() method.')
  }

  const factor = new JSBigNumber(10).pow(nativeTokenDecimals).div(new JSBigNumber(10).pow(tokenDecimals.toString()))
  const adjustedPrice = new JSBigNumber(ethPerToken).multipliedBy(factor) // WEI per token - adjusted for the token decimals
  const fee = new JSBigNumber(gasFee.toString()).div(adjustedPrice)
  const roundedFee = fee.toFixed(0, 2)
  const max = parseInt(roundedFee) < 1 ? '1' : roundedFee

  return BigNumber.from(max)
}

/**
 * Same as the calculateFee() method but requires a price conversion from BNB to the native currency
 * @param chainId the chainId of the network
 * @param token the payment token
 * @param tokenDecimals the decimals of the token
 * @param gasFee the transaction fee
 * @param env Deployment environment of the app. Default is production.
 * @returns the total amount of tokens to be paid for the transaction fee
 */
export async function calculateFeeThenConvert(
  chainId: ChainId,
  token: string,
  tokenDecimals: BigNumber,
  gasFee: BigNumber,
  env: Environment = Environment.PRODUCTION
): Promise<BigNumber> {
  const response = await fetchPrice(chainId, token, 'bnb', env)
  const data: Promise<any> = response.json().then(res => {
    if (Object.keys(res).length === 0) {
      throw new Error('Error: Unsupported fee token.')
    }
    return Object.values(res)[0]
  })
  const { bnb } = await data
  const adjustedBnbPerToken = new JSBigNumber(bnb)
    .multipliedBy(new JSBigNumber(10).pow(18))
    .div(new JSBigNumber(10).pow(tokenDecimals.toString()))

  const coinId = COIN_ID[chainId]
  const nativeBnbRatioApi = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=bnb`
  const nativeResponse = await fetch(nativeBnbRatioApi)
  const nativeResponseMap = await nativeResponse.json()
  const nativeData = nativeResponseMap[coinId!]
  const nativeBnb = nativeData['bnb']
  const bnbPerNative = new JSBigNumber(nativeBnb)

  const fee = new JSBigNumber(gasFee.toString()).div(adjustedBnbPerToken.div(bnbPerNative))
  const roundedFee = fee.toFixed(0, 2)
  const max = parseInt(roundedFee) < 1 ? '1' : roundedFee

  return BigNumber.from(max)
}
