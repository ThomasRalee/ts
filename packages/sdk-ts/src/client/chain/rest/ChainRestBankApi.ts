import { StatusCodes } from 'http-status-codes'
import {
  ErrorType,
  GeneralException,
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@thomasralee/exceptions'
import BaseRestConsumer from '../../BaseRestConsumer'
import { ChainModule, RestApiResponse } from '../types'
import { BalancesResponse, DenomBalance } from './../types/bank-rest'

/**
 * @category Chain Rest API
 */
export class ChainRestBankApi extends BaseRestConsumer {
  /**
   * Get address's balance
   *
   * @param address address of account to look up
   */
  public async fetchBalances(address: string): Promise<BalancesResponse> {
    try {
      const response = (await this.get(
        `cosmos/bank/v1beta1/balances/${address}`,
      )) as RestApiResponse<BalancesResponse>

      return response.data
    } catch (e) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Bank,
      })
    }
  }

  /**
   * Get address's balances
   *
   * @param address address of account to look up
   */
  public async fetchBalance(
    address: string,
    denom: string,
  ): Promise<DenomBalance> {
    try {
      const response = (await this.get(
        `cosmos/bank/v1beta1/balances/${address}`,
      )) as RestApiResponse<BalancesResponse>

      const balance = response.data.balances.find(
        (balance) => balance.denom === denom,
      )

      if (!balance) {
        throw new GeneralException(
          new Error(`The ${denom} balance was not found`),
          {
            code: StatusCodes.NOT_FOUND,
            type: ErrorType.NotFoundError,
          },
        )
      }

      return balance
    } catch (e) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      if (e instanceof GeneralException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Bank,
      })
    }
  }
}
