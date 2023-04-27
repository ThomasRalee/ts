import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { mockFactory } from '@thomasralee/test-utils'
import { CosmosBaseV1Beta1Coin } from '@injectivelabs/core-proto-ts'
import { ChainGrpcBankApi } from './ChainGrpcBankApi'
import { ChainGrpcBankTransformer } from '../transformers'

const { injectiveAddress } = mockFactory
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

describe('chainGrpcBankApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcBankApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcBankTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcBankApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })

  it('fetchBalance', async () => {
    try {
      const response = await chainGrpcBankApi.fetchBalance({
        accountAddress: injectiveAddress,
        denom: 'inj',
      })

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<CosmosBaseV1Beta1Coin.Coin>(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcBankApi.fetchModuleState => ${(e as any).message}`,
      )
    }
  })

  it('fetchBalances', async () => {
    try {
      const response = await chainGrpcBankApi.fetchBalances(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcBankTransformer.balancesResponseToBalances>
        >(response),
      )
    } catch (e) {
      console.error(`ChainGrpcBankApi.fetchBalances => ${(e as any).message}`)
    }
  })

  it('fetchTotalSupply', async () => {
    try {
      const response = await chainGrpcBankApi.fetchTotalSupply({ limit: 1 })

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcBankTransformer.totalSupplyResponseToTotalSupply
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcBankApi.fetchTotalSupply => ${(e as any).message}`,
      )
    }
  })
})
