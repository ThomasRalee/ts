import { InjectivePeggyV1Beta1Genesis } from '@injectivelabs/core-proto-ts'
import { Coin } from '@thomasralee/ts-types'

export type GrpcPeggyParams = InjectivePeggyV1Beta1Genesis.Params

export interface PeggyModuleParams extends GrpcPeggyParams {
  valsetReward: Coin
}
