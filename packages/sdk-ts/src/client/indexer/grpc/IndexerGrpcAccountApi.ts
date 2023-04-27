import { PaginationOption } from '../../../types/pagination'
import { IndexerGrpcAccountTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GeneralException,
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@thomasralee/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAccountApi {
  protected module: string = IndexerModule.Account

  protected client: InjectiveAccountRpc.InjectiveAccountsRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAccountRpc.InjectiveAccountsRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  /**
   * @deprecated - use IndexerGrpcAccountPortfolioApi.fetchPortfolio instead
   */
  async fetchPortfolio(_address: string) {
    throw new GeneralException(
      new Error(
        'deprecated - use IndexerGrpcAccountPortfolioApi.fetchPortfolio',
      ),
    )
  }

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = InjectiveAccountRpc.RewardsRequest.create()

    request.accountAddress = address

    if (epoch) {
      request.epoch = epoch.toString()
    }

    try {
      const response = await this.client.Rewards(request)

      return IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountsList(address: string) {
    const request = InjectiveAccountRpc.SubaccountsListRequest.create()

    request.accountAddress = address

    try {
      const response = await this.client.SubaccountsList(request)

      return response.subaccounts
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountBalance(subaccountId: string, denom: string) {
    const request =
      InjectiveAccountRpc.SubaccountBalanceEndpointRequest.create()

    request.subaccountId = subaccountId
    request.denom = denom

    try {
      const response = await this.client.SubaccountBalanceEndpoint(request)

      return IndexerGrpcAccountTransformer.balanceResponseToBalance(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountBalancesList(subaccountId: string) {
    const request = InjectiveAccountRpc.SubaccountBalancesListRequest.create()

    request.subaccountId = subaccountId

    try {
      const response = await this.client.SubaccountBalancesList(request)

      return IndexerGrpcAccountTransformer.balancesResponseToBalances(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountHistory({
    subaccountId,
    denom,
    transferTypes = [],
    pagination,
  }: {
    subaccountId: string
    denom?: string
    transferTypes?: string[]
    pagination?: PaginationOption
  }) {
    const request = InjectiveAccountRpc.SubaccountHistoryRequest.create()

    request.subaccountId = subaccountId

    if (denom) {
      request.denom = denom
    }

    if (transferTypes.length > 0) {
      request.transferTypes = transferTypes
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = pagination.endTime.toString()
      }
    }

    try {
      const response = await this.client.SubaccountHistory(request)

      return IndexerGrpcAccountTransformer.transferHistoryResponseToTransferHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountOrderSummary({
    subaccountId,
    marketId,
    orderDirection,
  }: {
    subaccountId: string
    marketId?: string
    orderDirection?: string
  }) {
    const request = InjectiveAccountRpc.SubaccountOrderSummaryRequest.create()

    request.subaccountId = subaccountId

    if (marketId) {
      request.marketId = marketId
    }

    if (orderDirection) {
      request.orderDirection = orderDirection
    }

    try {
      const response = await this.client.SubaccountOrderSummary(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchOrderStates(params?: {
    spotOrderHashes?: string[]
    derivativeOrderHashes?: string[]
  }) {
    const { spotOrderHashes = [], derivativeOrderHashes = [] } = params || {}
    const request = InjectiveAccountRpc.OrderStatesRequest.create()

    request.spotOrderHashes = spotOrderHashes
    request.derivativeOrderHashes = derivativeOrderHashes

    try {
      const response = await this.client.OrderStates(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
