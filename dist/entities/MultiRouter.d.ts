import { Pool, RToken, MultiRoute } from '../types/MultiRouterTypes';
export declare function findMultiRouting(from: RToken, to: RToken, amountIn: number, pools: Pool[], baseToken: RToken, gasPrice: number): MultiRoute | undefined;
