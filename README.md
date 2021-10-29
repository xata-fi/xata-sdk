# XATA SDK

In-depth documentation on this SDK is available at [uniswap.org](https://uniswap.org/docs/v2/SDK/getting-started/).

This modifies uniswap-sdk's UniswapV2Factory address. The new address for XATA are:

|Contract|Address|
|---|---|
|ConveyorV2Factory|`0x5f8017621825BC10D63d15C3e863f893946781F7`|
|ConveyorV2Router01|`0xe4C5Cf259351d7877039CBaE0e7f92EB2Ab017EB`|

---

## The `XATA-API` module

The source code for this module is located at `./src/xata-api`.

This module allows developers to seamlessly send transaction requests to the Geode endpoint using familiar function parameters. Each function bundles the process of EIP712 signing, fee token calculation and submitting meta txn into a single workflow. The functions supported are the following:
- `addLiquidity()`
- `swapExactTokensForTokens()`
- `swapTokensForExactTokens()`
- `removeLiquidity()`

Using this module, developers no longer require to manually construct a transaction request that looks like this:

```json
{
    "method": "POST",
    "headers": 
    {
        "Content-Type": "application/json"
    },
    "body": 
    "{\"jsonrpc\":\"2.0\",\"method\":\"/v2/metaTx/swapTokensForExactTokens\",\"id\":1,\"params\":[\"137\",{\"types\":{\"EIP712Domain\":[{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"chainId\",\"type\":\"uint256\"},{\"name\":\"verifyingContract\",\"type\":\"address\"}],\"Forwarder\":[{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"feeToken\",\"type\":\"address\"},{\"name\":\"maxTokenAmount\",\"type\":\"uint256\"},{\"name\":\"deadline\",\"type\":\"uint256\"},{\"name\":\"nonce\",\"type\":\"uint256\"},{\"name\":\"data\",\"type\":\"bytes\"},{\"name\":\"hashedPayload\",\"type\":\"bytes32\"}]},\"domain\":{\"name\":\"ConveyorV2\",\"version\":\"1\",\"chainId\":\"0x89\",\"verifyingContract\":\"0xe4C5Cf259351d7877039CBaE0e7f92EB2Ab017EB\"},\"primaryType\":\"Forwarder\",\"message\":{\"from\":\"0x10D73FE8e15414E7F1468eeb7A5A61A1aeec00C8\",\"feeToken\":\"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174\",\"maxTokenAmount\":\"0x01\",\"deadline\":\"0x6179545d\",\"nonce\":\"0x20\",\"data\":\"0xf208e6ab000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f185900000000000000000000000000000000000000000000000000000000000000a000000000000000000000000010d73fe8e15414e7f1468eeb7a5a61a1aeec00c8000000000000000000000000000000000000000000000000000000006179545d00000000000000000000000000000000000000000000000000000000000000020000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f\",\"hashedPayload\":\"0x5d299a1b988679b037e32d430bf2fbf03d5eb93949968c076c745ff2ffc18fe3\"}},\"28\",\"0xd8d7fdacaec4de579ee45c079cea896b576e994539f7980ec2ffb0c268fc07e3\",\"0x30dec79f68543f5785931f729ced63aabf5bc26219a11031150bced204d78ece\"]}"
}
```

To use the module, simply do the following 3 steps:
1. Declare an instance of the XATA module.

```typescript
import { Xata } from '@xata/sdk';

const xataApi = new Xata();
```

2. Initiate the instance

```typescript
const feeToken = '<0xAddress>'
await xataApi.init(web3Provider, feeToken)

// use this method to change the fee token
const otherFeeToken = '<0xOtherAddress>'
await xataApi.setFeeToken(otherFeeToken)
```

3. Interact with XATA

All functions return the API response of the transaction.

```typescript
const amountIn = ethers.BigNumber.from('5');
const amountOutMax = ethers.BigNumber.from('5');
const path = ['0xtokenA', '0xtokenB'];
const deadline = ethers.BigNumber.from('999');
const user = '0xUserAddress';

const swapResponse = await xataApi.swapExactTokensForTokens(
    amountIn,
    amountOutMax,
    path,
    user,
    deadline,
    gasLimit, // OPTIONAL
    gasPrice // OPTIONAL
)

// response example
// {
//     "jsonrpc": "2.0",
//     "result": {
//         "errorMessage": null,
//         "success": true,
//         "txnHash": "0x3a130c90692053f412a26f6d7914bb7637f0193c0a7054621d3e3c3a7d13c24a"
//     },
//     "id": 1
// }
```

For a detailed example, check out `./src/xata-api/example/example.ts`.