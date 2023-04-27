import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@thomasralee/exceptions'
import BaseRestConsumer from '../../BaseRestConsumer'
import { IndexerModule } from '../types'
import { ChronosMarketHistoryResponse } from '../types/markets-history-rest'

export class IndexerRestMarketChronosApi extends BaseRestConsumer {
  async fetchMarketsHistory({
    marketIds,
    resolution,
    countback,
  }: {
    marketIds: string[]
    resolution: string | number
    countback: string | number
  }) {
    const path = `history`
    const queryMarketIds = marketIds.map((marketId) => ({
      marketIDs: marketId,
    }))

    const params = [
      ...queryMarketIds,
      { resolution: String(resolution) },
      { countback: String(countback) },
    ] as Record<string, string>[]
    const stringifiedParams = params
      .map((param) => new URLSearchParams(param))
      .join('&')
    const pathWithParams = `${path}?${stringifiedParams}`

    try {
      const { data } = (await this.get(
        pathWithParams,
      )) as ChronosMarketHistoryResponse

      return data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: IndexerModule.ChronosMarkets,
      })
    }
  }
}
