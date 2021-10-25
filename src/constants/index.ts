import JSBI from 'jsbi'
import { Exchanger } from '../enums/Exchanger'
import { TokenType } from '../enums/Liquidity'

export * from './addresses'
export * from './kashi'
export * from './natives'
export * from './numbers'
export * from './tokens'

export const LIQUIDITY_TOKEN_IDENTITY: {[tokenType in TokenType]: string[]} = {
  [TokenType.UNISWAP]: ['UNI-V2', 'Uniswap V2'],
  [TokenType.XATA]: ['CON-V2', 'Conveyor V2']
}

export const INIT_CODE_HASH: {[exchanger in Exchanger]: string} = {
  [Exchanger.SUSHI]: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
  [Exchanger.XATA]: '0xf7b68428a2644f9a0d674330d4e4af2d7c3d2797a7f5766d3a86c223c4e12d17'
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

export const LAMBDA_URL = 'https://9epjsvomc4.execute-api.us-east-1.amazonaws.com/dev'

export const SOCKET_URL = 'wss://hfimt374ge.execute-api.us-east-1.amazonaws.com/dev'
