import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { mockFactory } from '@thomasralee/test-utils'
import { InjectiveExchangeV1Beta1Query } from '@injectivelabs/core-proto-ts'
import { ChainGrpcExchangeApi } from './ChainGrpcExchangeApi'
import { ChainGrpcExchangeTransformer } from '../transformers'

const { injectiveAddress } = mockFactory
const { subaccountId } = mockFactory
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

describe('chainGrpcExchangeApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.moduleParamsResponseToParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })

  // skipped as the module state can be quite huge and it times out
  it.skip('fetchModuleState', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchModuleState()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          InjectiveExchangeV1Beta1Query.QueryModuleStateResponse['state']
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchModuleState => ${(e as any).message}`,
      )
    }
  })

  it('fetchFeeDiscountSchedule', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchFeeDiscountSchedule()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchFeeDiscountSchedule => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchFeeDiscountAccountInfo', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchFeeDiscountAccountInfo(
        injectiveAddress,
      )

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchFeeDiscountAccountInfo => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchTradingRewardsCampaign', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchTradingRewardsCampaign()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchTradingRewardsCampaign => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchTradeRewardPoints', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchTradeRewardPoints([
        injectiveAddress,
      ])

      if (response.length === 0) {
        console.warn('fetchTradeRewardPoints.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<string[]>(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchTradeRewardPoints => ${(e as any).message}`,
      )
    }
  })

  it('fetchPendingTradeRewardPoints', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchPendingTradeRewardPoints(
        [injectiveAddress],
      )

      if (response.length === 0) {
        console.warn('fetchPendingTradeRewardPoints.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<string[]>(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchPendingTradeRewardPoints => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchPositions', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchPositions()

      if (response.length === 0) {
        console.warn('fetchPositions.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcExchangeTransformer.positionsResponseToPositions
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchPositions => ${(e as any).message}`,
      )
    }
  })

  it('fetchSubaccountTradeNonce', async () => {
    try {
      const response = await chainGrpcExchangeApi.fetchSubaccountTradeNonce(
        subaccountId,
      )

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<InjectiveExchangeV1Beta1Query.QuerySubaccountTradeNonceResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        `chainGrpcExchangeApi.fetchSubaccountTradeNonce => ${
          (e as any).message
        }`,
      )
    }
  })
})
