import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { mockFactory } from '@thomasralee/test-utils'
import { ChainGrpcAuthApi } from './ChainGrpcAuthApi'
import { ChainGrpcAuthTransformer } from '../transformers/ChainGrpcAuthTransformer'

const { injectiveAddress } = mockFactory
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)

describe('chainGrpcAuthApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcAuthApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcAuthTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcAuthApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })

  it('fetchAccount', async () => {
    try {
      const response = await chainGrpcAuthApi.fetchAccount(injectiveAddress)

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcAuthTransformer.grpcAccountToAccount>
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcAuthApi.fetchModuleState => ${(e as any).message}`,
      )
    }
  })

  it('fetchAccounts', async () => {
    try {
      const response = await chainGrpcAuthApi.fetchAccounts({ limit: 1 })

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcAuthTransformer.accountsResponseToAccounts>
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcAuthApi.fetchCurrentBasket => ${(e as any).message}`,
      )
    }
  })
})
