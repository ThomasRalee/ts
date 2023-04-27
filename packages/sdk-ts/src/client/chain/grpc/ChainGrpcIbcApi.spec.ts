import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { IbcApplicationsTransferV1Transfer } from '@injectivelabs/core-proto-ts'
import { ChainGrpcIbcApi } from './ChainGrpcIbcApi'
import { sha256 } from '../../../utils/crypto'
import { fromUtf8 } from '../../../utils/utf8'

const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcIbcApi = new ChainGrpcIbcApi(endpoints.grpc)

describe('chainGrpcIbcApi', () => {
  it('fetchDenomsTrace', async () => {
    try {
      const response = await chainGrpcIbcApi.fetchDenomsTrace()
      if (response.length === 0) {
        console.warn('fetchDenomsTrace.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<IbcApplicationsTransferV1Transfer.DenomTrace[]>(
          response,
        ),
      )
    } catch (e) {
      console.error(`chainGrpcIbcApi.fetchDenomsTrace => ${(e as any).message}`)
    }
  })

  it('fetchDenomTrace', async () => {
    try {
      const [trace] = await chainGrpcIbcApi.fetchDenomsTrace()
      const ibcHash = Buffer.from(
        sha256(fromUtf8(`${trace.path}/${trace.baseDenom}`)),
      ).toString('hex')
      const response = await chainGrpcIbcApi.fetchDenomTrace(ibcHash)

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<IbcApplicationsTransferV1Transfer.DenomTrace>(
          response,
        ),
      )
    } catch (e) {
      console.error(`chainGrpcIbcApi.fetchDenomTrace => ${(e as any).message}`)
    }
  })
})
