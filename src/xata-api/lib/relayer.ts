import { ChainId, Environment } from '../../enums'
import { AddressMap } from '../../types'

export const RELAYER_ENDPOINT_MAP: { [env in Environment]: AddressMap } = {
  [Environment.PRODUCTION]: {
    [ChainId.MAINNET]: '',
    [ChainId.ROPSTEN]: '',
    [ChainId.RINKEBY]: '',
    [ChainId.GÖRLI]: '',
    [ChainId.KOVAN]: '',
    [ChainId.FANTOM]: '',
    [ChainId.FANTOM_TESTNET]: '',
    [ChainId.MATIC]: 'https://conveyor-prod-matic.ata.network',
    [ChainId.MATIC_TESTNET]: '',
    [ChainId.XDAI]: '',
    [ChainId.BSC]: 'https://conveyor-prod-bsc.ata.network',
    [ChainId.BSC_TESTNET]: '',
    [ChainId.ARBITRUM]: 'https://conveyor-prod-arbitrum.ata.network',
    [ChainId.MOONRIVER]: 'https://conveyor-prod-moonriver.ata.network',
    [ChainId.ARBITRUM_TESTNET]: '',
    [ChainId.MOONBEAM_TESTNET]: '',
    [ChainId.AVALANCHE]: '',
    [ChainId.AVALANCHE_TESTNET]: '',
    [ChainId.HECO]: '',
    [ChainId.HECO_TESTNET]: '',
    [ChainId.HARMONY]: '',
    [ChainId.HARMONY_TESTNET]: '',
    [ChainId.OKEX]: '',
    [ChainId.OKEX_TESTNET]: '',
    [ChainId.CELO]: '',
    [ChainId.PALM]: '',
    [ChainId.PALM_TESTNET]: ''
  },
  [Environment.STAGING]: {
    [ChainId.MAINNET]: 'https://gtoken-geode-staging.ata.network',
    [ChainId.ROPSTEN]: '',
    [ChainId.RINKEBY]: '',
    [ChainId.GÖRLI]: '',
    [ChainId.KOVAN]: '',
    [ChainId.FANTOM]: '',
    [ChainId.FANTOM_TESTNET]: '',
    [ChainId.MATIC]: 'https://gtoken-geode-staging.ata.network',
    [ChainId.MATIC_TESTNET]: '',
    [ChainId.XDAI]: '',
    [ChainId.BSC]: 'https://gtoken-geode-staging.ata.network',
    [ChainId.BSC_TESTNET]: 'https://gtoken-geode-staging.ata.network',
    [ChainId.ARBITRUM]: 'https://gtoken-geode-staging.ata.network',
    [ChainId.ARBITRUM_TESTNET]: '',
    [ChainId.MOONBEAM_TESTNET]: '',
    [ChainId.AVALANCHE]: '',
    [ChainId.AVALANCHE_TESTNET]: '',
    [ChainId.HECO]: '',
    [ChainId.HECO_TESTNET]: '',
    [ChainId.HARMONY]: '',
    [ChainId.HARMONY_TESTNET]: '',
    [ChainId.OKEX]: '',
    [ChainId.OKEX_TESTNET]: '',
    [ChainId.CELO]: '',
    [ChainId.PALM]: '',
    [ChainId.PALM_TESTNET]: '',
    [ChainId.MOONRIVER]: 'https://gtoken-geode-staging.ata.network'
  }
}
