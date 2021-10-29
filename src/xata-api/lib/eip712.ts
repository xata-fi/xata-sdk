import { BigNumber, Signature, utils } from 'ethers'
const { keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } = utils
import {
  encodeAddLiquidity,
  encodeSwapExactTokensForTokens,
  encodeSwapTokensForExactTokens,
  encodeRemoveLiquidityWithPermit
} from './functionEncoder'

// EIP712 Types
export const DomainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
]
export const PermitType = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' }
]
export const ForwarderType = [
  { name: 'from', type: 'address' },
  { name: 'feeToken', type: 'address' },
  { name: 'maxTokenAmount', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
  { name: 'hashedPayload', type: 'bytes32' }
]

// hash payloads
export function hashAddLiquidityPayload(
  tokenA: string,
  tokenB: string,
  amountADesired: BigNumber,
  amountBDesired: BigNumber,
  amountAMin: BigNumber,
  amountBMin: BigNumber,
  user: string,
  deadline: BigNumber
): string {
  const ADDLIQUIDITY_TYPEHASH = keccak256(
    toUtf8Bytes(
      'AddLiquidity(address tokenA,address tokenB,uint256 amountADesired,uint256 amountBDesired,uint256 amountAMin,uint256 amountBMin,address user,uint256 deadline)'
    )
  )

  return keccak256(
    defaultAbiCoder.encode(
      ['bytes', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'address', 'uint256'],
      [ADDLIQUIDITY_TYPEHASH, tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin, user, deadline]
    )
  )
}
export function hashSwapPayload(
  amount0: BigNumber,
  amount1: BigNumber,
  path: string[],
  user: string,
  deadline: BigNumber
): string {
  const SWAP_TYPEHASH = keccak256(
    toUtf8Bytes('Swap(uint256 amount0,uint256 amount1,address[] path,address user,uint256 deadline)')
  )

  return keccak256(
    defaultAbiCoder.encode(
      ['bytes', 'uint256', 'uint256', 'bytes32', 'address', 'uint256'],
      [SWAP_TYPEHASH, amount0, amount1, keccak256(solidityPack(['address[]'], [path])), user, deadline]
    )
  )
}
export function hashRemoveLiquidityPayload(
  tokenA: string,
  tokenB: string,
  liquidity: BigNumber,
  amountAMin: BigNumber,
  amountBMin: BigNumber,
  user: string,
  deadline: BigNumber,
  sig: Signature
): string {
  const REMOVE_LIQUIDITY_TYPEHASH = keccak256(
    toUtf8Bytes(
      'RemoveLiquidity(address tokenA,address tokenB,uint256 liquidity,uint256 amountAMin,uint256 amountBMin,address user,uint256 deadline,uint8 v,bytes32 r,bytes32 s)'
    )
  )
  return keccak256(
    defaultAbiCoder.encode(
      [
        'bytes',
        'address',
        'address',
        'uint256',
        'uint256',
        'uint256',
        'address',
        'uint256',
        'uint8',
        'bytes32',
        'bytes32'
      ],
      [
        REMOVE_LIQUIDITY_TYPEHASH,
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        user,
        deadline,
        sig.v,
        sig.r,
        sig.s
      ]
    )
  )
}

// message
export interface TypedDomain {
  name: string
  version: string
  chainId: string
  verifyingContract: string
}
export interface TypedForwarder {
  from: string
  feeToken: string
  maxTokenAmount: string // hexstring
  deadline: string // hexstring
  nonce: string // hexstring
  data: string
  hashedPayload: string
}

export function getDomain(contractAddress: string, chain_id: number, domain_name: string): TypedDomain {
  return {
    name: domain_name,
    version: '1',
    chainId: BigNumber.from(chain_id).toHexString(),
    verifyingContract: contractAddress
  }
}
export function buildMessage(
  args: Array<any>,
  method: string,
  feeToken: string,
  maxTokenAmount: BigNumber,
  nonce: BigNumber
): TypedForwarder {
  let hashedPayload: string = ''
  let data: string = ''
  let typedArgs
  let deadline: string = ''
  let from: string = ''
  switch (method) {
    case 'addLiquidity':
      typedArgs = args as [string, string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber]
      hashedPayload = hashAddLiquidityPayload(...typedArgs)
      data = encodeAddLiquidity(...typedArgs)
      deadline = args[args.length - 1].toHexString()
      from = args[args.length - 2]
      break
    case 'swapExactTokensForTokens':
      typedArgs = args as [BigNumber, BigNumber, string[], string, BigNumber]
      hashedPayload = hashSwapPayload(...typedArgs)
      data = encodeSwapExactTokensForTokens(...typedArgs)
      deadline = args[args.length - 1].toHexString()
      from = args[args.length - 2]
      break
    case 'swapTokensForExactTokens':
      typedArgs = args as [BigNumber, BigNumber, string[], string, BigNumber]
      hashedPayload = hashSwapPayload(...typedArgs)
      data = encodeSwapTokensForExactTokens(...typedArgs)
      deadline = args[args.length - 1].toHexString()
      from = args[args.length - 2]
      break
    case 'removeLiquidity':
      typedArgs = args as [string, string, BigNumber, BigNumber, BigNumber, string, BigNumber, Signature]
      hashedPayload = hashRemoveLiquidityPayload(...typedArgs)
      data = encodeRemoveLiquidityWithPermit(...typedArgs)
      deadline = args[args.length - 2].toHexString()
      from = args[args.length - 3]
      break
    default:
      throw new Error('Error: Method not recognized!')
  }
  return {
    from: from,
    feeToken: feeToken,
    maxTokenAmount: maxTokenAmount.toHexString(),
    deadline: deadline,
    nonce: nonce.toHexString(),
    data: data,
    hashedPayload: hashedPayload
  }
}
