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
  [TokenType.CONVEYOR]: ['CON-V2', 'Conveyor V2']
}

export const INIT_CODE_HASH: {[exchanger in Exchanger]: string} = {
  [Exchanger.SUSHI]: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
  [Exchanger.CONVEYOR]: '0xa99ffa392d5d95a688d9158d3f51df02bf6d94b75f1da34a3cdadeb80fe9002b'
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
