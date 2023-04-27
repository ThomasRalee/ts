import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { IndexerGrpcMetaApi } from './IndexerGrpcMetaApi'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcMetaApi = new IndexerGrpcMetaApi(endpoints.indexer)

describe('IndexerGrpcMetaApi', () => {
  test('fetchPing', async () => {
    try {
      const response = await indexerGrpcMetaApi.fetchPing()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMetaApi.fetchPing => ' + (e as any).message)
    }
  })

  test('fetchVersion', async () => {
    try {
      const response = await indexerGrpcMetaApi.fetchVersion()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMetaApi.fetchVersion => ' + (e as any).message)
    }
  })

  test('fetchInfo', async () => {
    try {
      const response = await indexerGrpcMetaApi.fetchInfo()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<typeof response>(response),
      )
    } catch (e) {
      console.error('IndexerGrpcMetaApi.fetchInfo => ' + (e as any).message)
    }
  })
})
