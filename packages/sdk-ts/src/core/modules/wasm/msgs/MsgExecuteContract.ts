import { ExecArgs } from '../exec-args'
import { MsgBase } from '../../MsgBase'
import { GeneralException } from '@thomasralee/exceptions'
import snakecaseKeys from 'snakecase-keys'
import { fromUtf8 } from '../../../../utils/utf8'
import {
  CosmosBaseV1Beta1Coin,
  CosmwasmWasmV1Tx,
} from '@injectivelabs/core-proto-ts'

export declare namespace MsgExecuteContract {
  export interface Params {
    /* Keep in mind that funds have to be lexicographically sorted by denom */
    funds?:
      | {
          denom: string
          amount: string
        }
      | {
          denom: string
          amount: string
        }[]
    sender: string
    contractAddress: string
    /* Used to provide type safety for execution messages */
    execArgs?: ExecArgs
    /* Pass any arbitrary message object to execute */
    exec?: {
      msg: object
      action: string
    }
    /**
     * Same as exec but you don't pass
     * the action as a separate property
     * but as a whole object
     */
    msg?: object
  }

  export type Proto = CosmwasmWasmV1Tx.MsgExecuteContract

  export type Object = Omit<CosmwasmWasmV1Tx.MsgExecuteContract, 'msg'> & {
    msg: any
  }
}

/**
 * @category Messages
 */
export default class MsgExecuteContract extends MsgBase<
  MsgExecuteContract.Params,
  MsgExecuteContract.Proto,
  MsgExecuteContract.Object
> {
  static fromJSON(params: MsgExecuteContract.Params): MsgExecuteContract {
    return new MsgExecuteContract(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmwasmWasmV1Tx.MsgExecuteContract.create()
    const msg = this.getMsgObject()

    message.msg = fromUtf8(JSON.stringify(msg))
    message.sender = params.sender
    message.contract = params.contractAddress

    if (params.funds) {
      const fundsToArray = Array.isArray(params.funds)
        ? params.funds
        : [params.funds]

      const funds = fundsToArray.map((coin) => {
        const funds = CosmosBaseV1Beta1Coin.Coin.create()

        funds.amount = coin.amount
        funds.denom = coin.denom

        return funds
      })

      message.funds = funds
    }

    return CosmwasmWasmV1Tx.MsgExecuteContract.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    const message = {
      ...snakecaseKeys(proto),
      msg: this.getMsgObject(),
    }

    return {
      type: 'wasm/MsgExecuteContract',
      value: message as unknown as MsgExecuteContract.Object,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgExecuteContract',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgExecuteContract',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmwasmWasmV1Tx.MsgExecuteContract.encode(this.toProto()).finish()
  }

  private getMsgObject() {
    const { params } = this

    if ((params.exec || params.msg) && params.execArgs) {
      throw new GeneralException(
        new Error('Please provide only one exec|msg argument'),
      )
    }

    if (params.execArgs) {
      return params.execArgs.toExecData()
    }

    if (params.exec) {
      return {
        [params.exec.action]: params.exec.msg,
      }
    }

    if (params.msg) {
      return params.msg
    }

    throw new GeneralException(
      new Error('Please provide at least one exec argument'),
    )
  }
}
