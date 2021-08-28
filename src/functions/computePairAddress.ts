import { keccak256, pack } from '@ethersproject/solidity'

// import { INIT_CODE_HASH } from '../constants'
import { Token } from '../entities'
import { getCreate2Address } from '@ethersproject/address'
import { initCodeHashOf } from './determiner'
import { Exchanger } from '../enums/Exchanger'

export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  isConveyorPair = false
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  isConveyorPair: boolean
}): string => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const exchanger = !isConveyorPair ? Exchanger.SUSHI : Exchanger.CONVEYOR
  return getCreate2Address(
    factoryAddress,
    keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
    // INIT_CODE_HASH
    initCodeHashOf(exchanger)
  )
}
