import { Response } from '../xata';
import { JsonRpcProvider } from '@ethersproject/providers';
/**
 * This function listens for the MetaStatus event emitted from the router contract.
 * Failure of meta-txn execution does not cause the transaction to revert, therefore this method is necessory to extract
 * the failure message.
 * @param provider
 * @param response
 */
export declare function verifyMetaTxnResponse(provider: JsonRpcProvider, response: Response): Promise<Response>;
