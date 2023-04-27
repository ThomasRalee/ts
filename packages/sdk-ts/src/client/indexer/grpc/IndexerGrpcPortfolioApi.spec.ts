import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { mockFactory } from '@thomasralee/test-utils'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'
import { IndexerGrpcAccountPortfolioApi } from './IndexerGrpcPortfolioApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcPortfolioApi = new IndexerGrpcAccountPortfolioApi(
  endpoints.indexer,
)

describe('IndexerGrpcAccountPortfolioApi', () => {
  test('fetchAccountPortfolio', async () => {
    try {
      const response = await indexerGrpcPortfolioApi.fetchAccountPortfolio(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAccountPortfolioTransformer.accountPortfolioResponseToAccountPortfolio
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAccountPortfolioApi.fetchAccountPortfolio => ' +
          (e as any).message,
      )
    }
  })
})
