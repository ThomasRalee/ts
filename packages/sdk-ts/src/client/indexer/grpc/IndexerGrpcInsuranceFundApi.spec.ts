import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { mockFactory } from '@thomasralee/test-utils'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers'
import { IndexerGrpcInsuranceFundApi } from './IndexerGrpcInsuranceFundApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(
  endpoints.indexer,
)

describe('IndexerGrpcInsuranceFundApi', () => {
  test('fetchRedemptions', async () => {
    try {
      const response = await indexerGrpcInsuranceFundApi.fetchRedemptions({
        address: injectiveAddress,
      })

      if (response.length === 0) {
        console.warn('fetchRedemptions.redemptionsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcInsuranceFundApi.fetchRedemptions => ' + (e as any).message,
      )
    }
  })

  test('fetchInsuranceFunds', async () => {
    try {
      const response = await indexerGrpcInsuranceFundApi.fetchInsuranceFunds()

      if (response.length === 0) {
        console.warn('fetchInsuranceFunds.redemptionsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcInsuranceFundApi.fetchInsuranceFunds => ' +
          (e as any).message,
      )
    }
  })
})
