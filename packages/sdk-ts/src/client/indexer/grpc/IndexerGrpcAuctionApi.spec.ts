import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { IndexerGrpcAuctionTransformer } from '../transformers'
import { IndexerGrpcAuctionApi } from './IndexerGrpcAuctionApi'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer)

describe('IndexerGrpcAuctionApi', () => {
  test('fetchAuction', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAuction(-1)

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.auctionResponseToAuction
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAuction => ' + (e as any).message,
      )
    }
  })

  test('fetchAuctions', async () => {
    try {
      const response = await indexerGrpcAuctionApi.fetchAuctions()

      if (response.length === 0) {
        console.warn('fetchSubaccountHistory.auctionsIsEmptyArray')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpcAuctionTransformer.auctionsResponseToAuctions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcAuctionApi.fetchAuctions => ' + (e as any).message,
      )
    }
  })
})
