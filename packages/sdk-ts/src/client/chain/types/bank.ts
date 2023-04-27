import { CosmosBankV1Beta1Bank } from '@injectivelabs/core-proto-ts'
import { Coin } from '@thomasralee/ts-types'

export interface BankModuleParams {
  sendEnabledList: Array<SendEnabled>
  defaultSendEnabled: boolean
}

export interface TotalSupply extends Array<Coin> {
  //
}

export type GrpcSupply = CosmosBankV1Beta1Bank.Supply
export type GrpcBankParams = CosmosBankV1Beta1Bank.Params
export type SendEnabled = CosmosBankV1Beta1Bank.SendEnabled
