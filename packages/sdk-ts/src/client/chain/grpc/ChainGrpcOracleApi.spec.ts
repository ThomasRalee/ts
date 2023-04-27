import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { ChainGrpcOracleApi } from './ChainGrpcOracleApi'
import { OracleModuleParams } from '../types'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcOracleApi = new ChainGrpcOracleApi(endpoints.grpc)

describe('chainGrpcOracleApi', () => {
  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcOracleApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<OracleModuleParams>(response),
      )
    } catch (e) {
      console.error(
        `chainGrpcOracleApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })
})
