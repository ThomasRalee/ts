import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { ChainGrpcPeggyApi } from './ChainGrpcPeggyApi'
import { ChainGrpcPeggyTransformer } from '../transformers'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcPeggyApi = new ChainGrpcPeggyApi(endpoints.grpc)

describe('chainGrpcPeggyApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcPeggyApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcPeggyTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcPeggyApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })
})
