import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { ChainGrpcAuctionTransformer } from '../transformers'
import { ChainGrpcAuctionApi } from './ChainGrpcAuctionApi'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc)

describe('chainGrpcAuctionApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcAuctionApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcAuctionApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })

  it('fetchModuleState', async () => {
    try {
      const response = await chainGrpcAuctionApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcAuctionApi.fetchModuleState => ${(e as any).message}`,
      )
    }
  })

  it('fetchCurrentBasket', async () => {
    try {
      const response = await chainGrpcAuctionApi.fetchCurrentBasket()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcAuctionApi.fetchCurrentBasket => ${(e as any).message}`,
      )
    }
  })
})
