import { BigNumber, ethers, utils, constants as ethersConstants, Signature } from 'ethers'
import * as eip712 from './lib/eip712'
import * as constants from './lib/constants'
import { FACTORY_ADDRESS, ROUTER_ADDRESS } from '../constants'
import { calculateFee, calculateFeeThenConvert } from './lib/fee'
import { JsonRpcProvider } from '@ethersproject/providers'
import { abi as RouterAbi } from '../abis/ConveyorV2Router01.json'
import { abi as FactoryAbi } from '../abis/ConveyorV2Factory.json'
import { abi as PairAbi } from '../abis/ConveyorV2Pair.json'
import { abi as ERC20Abi } from '../abis/ERC20.json'
import { Environment, ChainId } from '../enums'
import { RELAYER_ENDPOINT_MAP } from './lib/relayer'
import { SignatureLike } from '@ethersproject/bytes'
import { verifyMetaTxnResponse } from './lib/event-listener'
const { splitSignature, verifyTypedData } = utils

const zeroAddress = ethersConstants.AddressZero

export interface Response {
  id: number
  jsonrpc: string
  result: {
    errorMessage: string
    success: boolean
    txnHash: string
  }
}

export default class Xata {
  chainId: number = -1
  geodeEndpoint: string = ''
  provider?: JsonRpcProvider
  feeToken?: ethers.Contract
  routerContract?: ethers.Contract
  factoryContract?: ethers.Contract
  _e?: Environment

  // Must be called immediately after instantiating the class
  async init(provider: JsonRpcProvider, feeTokenAddr: string, env: Environment = Environment.PRODUCTION) {
    this._e = env
    this.chainId = (await provider.getNetwork()).chainId
    this.provider = provider
    this.feeToken = new ethers.Contract(feeTokenAddr, ERC20Abi, provider)
    this.factoryContract = new ethers.Contract(FACTORY_ADDRESS, FactoryAbi, provider)
    this.routerContract = new ethers.Contract(ROUTER_ADDRESS, RouterAbi, provider)
    this.geodeEndpoint = RELAYER_ENDPOINT_MAP[env][this.chainId]
    if (this.geodeEndpoint.length === 0) {
      throw new Error(`Chain ID ${this.chainId} not supported`)
    }
  }

  _checkInit() {
    const notInit =
      this.chainId === -1 ||
      this.feeToken === undefined ||
      this.geodeEndpoint === '' ||
      this.factoryContract === undefined ||
      this.routerContract === undefined ||
      this.provider === undefined

    if (notInit) {
      throw new Error('Error: XATA API has not been initialized yet!')
    }
  }

  async _pathExists(path: string[]): Promise<boolean> {
    const factory = this.factoryContract
    for (let i = 0; i < path.length - 2; i++) {
      const addr = await factory!.getPair(path[i], path[i + 1])
      if (addr === zeroAddress) {
        return false
      }
    }
    return true
  }

  _verifySignature(
    domain: eip712.TypedDomain,
    message: eip712.TypedForwarder,
    signature: Signature,
    signerAddress: string
  ): boolean {
    const recovered = verifyTypedData(domain, { Forwarder: eip712.ForwarderType }, message, signature)
    return recovered === signerAddress
  }

  setFeeToken(feeTokenAddr: string) {
    this.feeToken = new ethers.Contract(feeTokenAddr, ERC20Abi, this.provider)
  }

  async sendRequest(args: Array<any>, method: string, gasLimit: BigNumber, gasPrice?: BigNumber): Promise<Response> {
    this._checkInit()
    const price: BigNumber = gasPrice ? gasPrice : await this.provider!.getGasPrice() // WEI per gas
    const txnFee = gasLimit.mul(price)
    const tokenDecimals = await this.feeToken!.decimals()

    // determine token gas price
    let maxTokenFee = BigNumber.from(0)

    switch (this.chainId) {
      case ChainId.MATIC:
        maxTokenFee = await calculateFeeThenConvert(
          this.chainId,
          this.feeToken!.address,
          tokenDecimals,
          txnFee,
          this._e
        )
        break
      case ChainId.MOONRIVER:
        maxTokenFee = await calculateFeeThenConvert(
          this.chainId,
          this.feeToken!.address,
          tokenDecimals,
          txnFee,
          this._e
        )
        break
      case ChainId.BSC:
        maxTokenFee = await calculateFee(
          this.chainId,
          this.feeToken!.address,
          tokenDecimals,
          txnFee,
          'bnb',
          18,
          this._e
        )
        break
      case ChainId.ARBITRUM:
        maxTokenFee = await calculateFee(
          this.chainId,
          this.feeToken!.address,
          tokenDecimals,
          txnFee,
          'eth',
          18,
          this._e
        )
        break
    }

    // fetch router info
    const provider = this.provider
    const signer = provider!.getSigner()

    const user = await signer.getAddress()
    const router = this.routerContract
    const nonce = await router!.nonces(user)

    // construct EIP712
    const message = eip712.buildMessage(args, method, this.feeToken!.address, maxTokenFee, nonce)
    const domain = eip712.getDomain(router!.address, this.chainId, 'ConveyorV2')
    const EIP712Content = {
      types: {
        EIP712Domain: eip712.DomainType,
        Forwarder: eip712.ForwarderType
      },
      domain: domain,
      primaryType: 'Forwarder',
      message: message
    }
    const sigParams = [user, JSON.stringify(EIP712Content)]
    let response: Response
    const metaIsEnabled = await router!.metaEnabled()
    if (metaIsEnabled) {
      // sign message
      const sig: Signature = await provider!.send('eth_signTypedData_v4', sigParams)
      const { v, r, s } = splitSignature(sig)

      const params = [this.chainId.toString(), EIP712Content, v.toString(), r, s]

      if (!this._verifySignature(domain, message, sig, user)) {
        throw new Error('Error: Invalid signature')
      }

      const jsonRpcRequest = {
        jsonrpc: '2.0',
        method: `/v2/metaTx/${method}`,
        id: 1,
        params
      }

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonRpcRequest)
      }

      // send request
      console.log('sending request...')
      console.log(requestOptions)
      const jsonRpcResponse = await fetch(this.geodeEndpoint, requestOptions)
      response = (await jsonRpcResponse.json()) as Response
      if (response.result.success) {
        response = await verifyMetaTxnResponse(this.provider!, response)
      }
    } else {
      // send the txn directly
      try {
        const tx = await signer.sendTransaction({
          to: router!.address,
          data: message.data,
          gasLimit: gasLimit,
          gasPrice: price
        })
        await tx.wait()
        response = {
          id: 1,
          jsonrpc: '2.0',
          result: {
            errorMessage: '',
            success: true,
            txnHash: tx.hash
          }
        }
      } catch (e) {
        const err = e as Error
        response = {
          id: 1,
          jsonrpc: '2.0',
          result: {
            errorMessage: err.message,
            success: false,
            txnHash: ''
          }
        }
      }
    }
    console.log('response: ')
    console.log(response)
    return response
  }

  async addLiquidity(
    _tokenA: string,
    _tokenB: string,
    _amountADesired: BigNumber,
    _amountBDesired: BigNumber,
    _amountAMin: BigNumber,
    _amountBMin: BigNumber,
    _user: string,
    _deadline: BigNumber,
    gasLimit?: BigNumber,
    gasPrice?: BigNumber
  ): Promise<Response> {
    this._checkInit()

    // check if a pair exists
    const pairExists: boolean = (await this.factoryContract!.getPair(_tokenA, _tokenB)) !== zeroAddress

    // get gas limit if not provided
    let limit: BigNumber
    if (gasLimit) {
      limit = gasLimit
    } else if (pairExists) {
      limit = BigNumber.from(
        this.chainId === ChainId.ARBITRUM
          ? constants.ARBITRUM_ADD_LIQUIDITY_GAS_LIMIT
          : constants.ADD_LIQUIDITY_GAS_LIMIT
      )
    } else {
      limit = BigNumber.from(
        this.chainId === ChainId.ARBITRUM ? constants.ARBITRUM_CREATE_PAIR_GAS_LIMIT : constants.CREATE_PAIR_GAS_LIMIT
      )
    }

    // trim gas price and gas limit
    let args: Array<any> = [...arguments]
    if (gasPrice) {
      args = args.slice(0, -2)
    } else if (gasLimit) {
      args = args.slice(0, -1)
    }
    args = args.filter(x => x !== undefined)

    return await this.sendRequest(args, 'addLiquidity', limit, gasPrice)
  }

  async swapExactTokensForTokens(
    _amountIn: BigNumber,
    _amountOutMin: BigNumber,
    _path: string[],
    _user: string,
    _deadline: BigNumber,
    gasLimit?: BigNumber,
    gasPrice?: BigNumber
  ): Promise<Response> {
    this._checkInit()

    const pathExists: boolean = (await this._pathExists(_path)) && _path.length >= 2

    // get gas limit if not provided
    let limit: BigNumber
    if (!pathExists) {
      throw new Error('Trade path does not exist.')
    } else {
      if (gasLimit) {
        limit = gasLimit
      } else {
        limit = BigNumber.from(
          this.chainId === ChainId.ARBITRUM ? constants.ARBITRUM_SWAP_GAS_LIMIT : constants.SWAP_GAS_LIMIT
        )
        if (_path.length >= 2) {
          limit = limit.add(BigNumber.from(constants.HOP_ADDITIONAL_GAS * (_path.length - 2)))
        }
      }
    }

    // trim gas price and gas limit
    let args: Array<any> = [...arguments]
    if (gasLimit && gasPrice) {
      args = args.slice(0, -2)
    } else if (gasLimit) {
      args = args.slice(0, -1)
    }
    args = args.filter(x => x !== undefined)

    return await this.sendRequest(args, 'swapExactTokensForTokens', limit, gasPrice)
  }

  async swapTokensForExactTokens(
    _amountOut: BigNumber,
    _amountInMax: BigNumber,
    _path: string[],
    _user: string,
    _deadline: BigNumber,
    gasLimit?: BigNumber,
    gasPrice?: BigNumber
  ): Promise<Response> {
    this._checkInit()

    const pathExists: boolean = (await this._pathExists(_path)) && _path.length >= 2

    // get gas limit if not provided
    let limit: BigNumber
    if (!pathExists) {
      throw new Error('Trade path does not exist.')
    } else {
      if (gasLimit) {
        limit = gasLimit
      } else {
        limit = BigNumber.from(
          this.chainId === ChainId.ARBITRUM ? constants.ARBITRUM_SWAP_GAS_LIMIT : constants.SWAP_GAS_LIMIT
        )
        if (_path.length >= 2) {
          limit = limit.add(BigNumber.from(constants.HOP_ADDITIONAL_GAS * (_path.length - 2)))
        }
      }
    }

    // trim gas price and gas limit
    let args: Array<any> = [...arguments]
    if (gasPrice) {
      args = args.slice(0, -2)
    } else if (gasLimit) {
      args = args.slice(0, -1)
    }
    args = args.filter(x => x !== undefined)

    return await this.sendRequest(args, 'swapTokensForExactTokens', limit, gasPrice)
  }

  // async removeLiquidity(
  //     _tokenA: string,
  //     _tokenB: string,
  //     _liquidity: BigNumber,
  //     _amountAMin: BigNumber,
  //     _amountBMin: BigNumber,
  //     _user: string,
  //     _deadline: BigNumber,
  //     gasLimit?: BigNumber,
  //     gasPrice?: BigNumber
  // ): Promise<Response> {
  //     this._checkInit();

  //     // check if a pair exists
  //     const pairAddr = await this.factoryContract!.getPair(_tokenA, _tokenB);
  //     const pairExists: boolean = pairAddr !== zeroAddress;

  //     // determine gas limit
  //     let limit: BigNumber;
  //     if (pairExists) {
  //         if (gasLimit) {
  //             limit = gasLimit;
  //         } else {
  //             limit = BigNumber.from(constants.REMOVE_LIQUIDITY_GAS_LIMIT);
  //         }
  //     } else {
  //         throw new Error("Pair does not exist.");
  //     }

  //     // sign the permit message
  //     const pairErc20 = new ethers.Contract(pairAddr, PairAbi, this.provider);
  //     const permitDomain = eip712.getDomain(pairAddr, this.chainId, 'Conveyor V2');
  //     const pairNonce = await pairErc20.nonces(_user);
  //     const permitMessage = {
  //         owner: _user,
  //         spender: this.routerContract!.address,
  //         value: _liquidity.toHexString(),
  //         nonce: pairNonce.toHexString(),
  //         deadline: _deadline.toHexString(),
  //     }
  //     const EIP712Permit = {
  //         types: {
  //             EIP712Domain: eip712.DomainType,
  //             Permit: eip712.PermitType
  //         },
  //         domain: permitDomain,
  //         primaryType: 'Permit',
  //         message: permitMessage
  //     }
  //     const permitSigParams = [_user, JSON.stringify(EIP712Permit)];

  //     const permitSig: Signature = await this.provider!.send(
  //         'eth_signTypedData_v4',
  //         permitSigParams
  //     )

  //     const { v, r, s } = splitSignature(permitSig);

  //     // trim gas price and gas limit
  //     let args: Array<any> = [...arguments];
  // if (gasPrice) {
  //   args = args.slice(0, -2)
  // } else if (gasLimit) {
  //   args = args.slice(0, -1)
  // }
  //     args = args.filter((x) => x !== undefined);

  //     const sigStruct = {
  //         v: v,
  //         r: r,
  //         s: s,
  //     }

  //     // append sig to args
  //     args.push(sigStruct);

  //     return (await this.sendRequest(args, 'removeLiquidity', limit, gasPrice));
  // }

  async permitLP(
    _pairAddr: string,
    _owner: string,
    _spender: string,
    _value: BigNumber,
    _nonce: BigNumber,
    _deadline: BigNumber
  ): Promise<SignatureLike> {
    // sign the permit message
    const pairErc20 = new ethers.Contract(_pairAddr, PairAbi, this.provider)
    const permitDomain = eip712.getDomain(_pairAddr, this.chainId, 'Conveyor V2')
    const pairNonce = await pairErc20.nonces(_owner)
    const permitMessage = {
      owner: _owner,
      spender: _spender,
      value: _value.toHexString(),
      nonce: pairNonce.toHexString(),
      deadline: _deadline.toHexString()
    }
    const EIP712Permit = {
      types: {
        EIP712Domain: eip712.DomainType,
        Permit: eip712.PermitType
      },
      domain: permitDomain,
      primaryType: 'Permit',
      message: permitMessage
    }
    const permitSigParams = [_owner, JSON.stringify(EIP712Permit)]

    const permitSig: Signature = await this.provider!.send('eth_signTypedData_v4', permitSigParams)

    const { v, r, s } = splitSignature(permitSig)

    const sigStruct = {
      v: v,
      r: r,
      s: s
    }

    return sigStruct
  }

  async removeLiquidity(
    _tokenA: string,
    _tokenB: string,
    _liquidity: BigNumber,
    _amountAMin: BigNumber,
    _amountBMin: BigNumber,
    _user: string,
    _deadline: BigNumber,
    _sig: SignatureLike,
    gasLimit?: BigNumber,
    gasPrice?: BigNumber
  ): Promise<Response> {
    this._checkInit()

    // check if a pair exists
    const pairAddr = await this.factoryContract!.getPair(_tokenA, _tokenB)
    const pairExists: boolean = pairAddr !== zeroAddress

    // determine gas limit
    let limit: BigNumber
    if (pairExists) {
      if (gasLimit) {
        limit = gasLimit
      } else {
        limit = BigNumber.from(
          this.chainId === ChainId.ARBITRUM
            ? constants.ARBITRUM_REMOVE_LIQUIDITY_GAS_LIMIT
            : constants.REMOVE_LIQUIDITY_GAS_LIMIT
        )
      }
    } else {
      throw new Error('Pair does not exist.')
    }

    // trim gas price and gas limit
    let args: Array<any> = [...arguments]
    if (gasPrice) {
      args = args.slice(0, -2)
    } else if (gasLimit) {
      args = args.slice(0, -1)
    }
    args = args.filter(x => x !== undefined)

    return await this.sendRequest(args, 'removeLiquidity', limit, gasPrice)
  }
}
