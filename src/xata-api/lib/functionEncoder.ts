import { utils, BigNumber, Signature } from 'ethers';

const sig_tuple = 'tuple(uint8 v, bytes32 r, bytes32 s)';

const addliquidity_tuple =
  'tuple(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address user, uint256 deadline)';
const addLiquiditySig = [`function addLiquidity(${addliquidity_tuple})`];
const addLiquidityIFace = new utils.Interface(addLiquiditySig);
export function encodeAddLiquidity(
    _tokenA: string,
    _tokenB: string,
    _amountADesired: BigNumber,
    _amountBDesired: BigNumber,
    _amountAMin: BigNumber,
    _amountBMin: BigNumber,
    _user: string,
    _deadline: BigNumber,
): string {
  const args = [...arguments];
  const typedArgs = args as [string, string, BigNumber, BigNumber, BigNumber, BigNumber, string, BigNumber];
  const res = addLiquidityIFace.encodeFunctionData('addLiquidity', [typedArgs]);
  return res;
}

const swap_tuple = 'tuple(uint256 amount0, uint256 amount1, address[] path, address user, uint256 deadline)';
const swapExactTokensForTokensSig = [`function swapExactTokensForTokens(${swap_tuple})`];
const swapTokensForExactTokensSig = [`function swapTokensForExactTokens(${swap_tuple})`];
const swapExactTokensForTokensIFace = new utils.Interface(swapExactTokensForTokensSig);
const swapTokensForExactTokensIFace = new utils.Interface(swapTokensForExactTokensSig);

export function encodeSwapExactTokensForTokens(
  _amountIn: BigNumber,
  _amountOutMin: BigNumber,
  _path: string[],
  _user: string,
  _deadline: BigNumber
): string {
  const args = [...arguments];
  const typedArgs = args as [BigNumber, BigNumber, string[], string, BigNumber];
  return swapExactTokensForTokensIFace.encodeFunctionData('swapExactTokensForTokens', [typedArgs]);
}
export function encodeSwapTokensForExactTokens(
  _amountOut: BigNumber,
  _amountInMax: BigNumber,
  _path: string[],
  _user: string,
  _deadline: BigNumber
): string {
  const args = [...arguments];
  const typedArgs = args as [BigNumber, BigNumber, string[], string, BigNumber];
  return swapTokensForExactTokensIFace.encodeFunctionData('swapTokensForExactTokens', [typedArgs]);
}

const removeLiquidity_tuple =
  'tuple(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address user, uint256 deadline)';
const removeLiquidityWithPermitSig = [`function removeLiquidityWithPermit(${removeLiquidity_tuple},${sig_tuple})`];
const removeLiquidityWithPermitIFace = new utils.Interface(removeLiquidityWithPermitSig);
export function encodeRemoveLiquidityWithPermit(
  _tokenA: string,
  _tokenB: string,
  _liquidity: BigNumber,
  _amountAMin: BigNumber,
  _amountBMin: BigNumber,
  _user: string,
  _deadline: BigNumber,
  _sig_obj: Signature
): string {
  const args = [...arguments];
  const trimmedArgs = args.slice(0, args.length - 1);
  const typedArgs = trimmedArgs as [string, string, BigNumber, BigNumber, BigNumber, string, BigNumber];
  return removeLiquidityWithPermitIFace.encodeFunctionData('removeLiquidityWithPermit', [typedArgs, _sig_obj]);
}