import Xata from '../xata'
import { BigNumber, ethers, utils } from 'ethers'

const { parseUnits } = utils

async function main() {
  // Prerequisite: app must connect to web3 first.
  const provider = new ethers.providers.JsonRpcProvider('')

  // // Metamask
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  // instantiate a XATA instance for mainnet

  // rpcProvider = localhost, feeToken = USD Coin, isLocalHostProvider = true <- defaults at false.
  const mainnetXata = new Xata()
  await mainnetXata.init(provider, '0xdAC17F958D2ee523a2206206994597C13D831ec7')

  // // switch fee token to DAI
  // mainnetXata.setFeeToken('0x6B175474E89094C44Da98b954EedeAC495271d0F');

  // attempts to add liquidity
  console.log('adding liquidity...')
  const addLiquidityResponse = await mainnetXata.addLiquidity(
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // tokenA <- USDT
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // tokenB <- DAI
    parseUnits('500', 6), // amountADesired
    parseUnits('500', 18), // amountBDesired
    parseUnits('200', 6), // amountAMin
    parseUnits('200', 18), // amountBMin
    '0x276768c9f87e68a03d8e0690766ff98c3a607efe', // user
    BigNumber.from(Math.ceil(Date.now() / 1000) + 10) // deadline
  )

  console.log(addLiquidityResponse)

  // attempts to swap
  console.log('swapping...')
  const swapResponse = await mainnetXata.swapExactTokensForTokens(
    parseUnits('10', 18), // amount0
    parseUnits('5', 6), // amount1
    ['0x6B175474E89094C44Da98b954EedeAC495271d0F', '0xdAC17F958D2ee523a2206206994597C13D831ec7'],
    '0x276768c9f87e68a03d8e0690766ff98c3a607efe', // user
    BigNumber.from(Math.ceil(Date.now() / 1000) + 10) // deadline
  )

  console.log(swapResponse)

  // attempts to remove liquidity
  // console.log('removing liquidity...');
  // const removeResponse = await mainnetXata.removeLiquidity(
  //     '0xdAC17F958D2ee523a2206206994597C13D831ec7', // tokenA <- USDT
  //     '0x6B175474E89094C44Da98b954EedeAC495271d0F', // tokenB <- DAI
  //     BigNumber.from('50000000000000'), // 10% of liquidity
  //     parseUnits('40', 6),
  //     parseUnits('40', 18),
  //     '0x276768c9f87e68a03d8e0690766ff98c3a607efe', // user
  //     BigNumber.from(Math.ceil((Date.now()) / 1000) + 10), // deadline
  // );

  // console.log(removeResponse);
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
  })
