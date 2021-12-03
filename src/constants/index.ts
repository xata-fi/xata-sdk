import JSBI from 'jsbi'

export * from './addresses'
export * from './natives'
export * from './numbers'
export * from './tokens'

export const LIQUIDITY_TOKEN_IDENTITY: string[] = ['CON-V2', 'Conveyor V2']

export const INIT_CODE_HASH: string = '0xf7b68428a2644f9a0d674330d4e4af2d7c3d2797a7f5766d3a86c223c4e12d17'

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
