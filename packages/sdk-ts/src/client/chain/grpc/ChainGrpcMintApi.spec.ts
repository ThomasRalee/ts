import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { ChainGrpcMintApi } from './ChainGrpcMintApi'
import { ChainGrpcMintTransformer } from '../transformers'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

describe('chainGrpcMintApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcMintApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcMintTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcMintApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })

  it('fetchInflation', async () => {
    try {
      const response = await chainGrpcMintApi.fetchInflation()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<{ inflation: string }>(response),
      )
    } catch (e) {
      console.error(`chainGrpcMintApi.fetchInflation => ${(e as any).message}`)
    }
  })

  it('fetchAnnualProvisions', async () => {
    try {
      const response = await chainGrpcMintApi.fetchAnnualProvisions()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<{ annualProvisions: string }>(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcMintApi.fetchAnnualProvisions => ${(e as any).message}`,
      )
    }
  })
})
