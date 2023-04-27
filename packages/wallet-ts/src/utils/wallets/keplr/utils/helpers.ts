import { ChainId } from '@thomasralee/ts-types'
import { getStdFee } from '@thomasralee/utils'
import { Msgs } from '@thomasralee/sdk-ts'

export const createEip712StdSignDoc = ({
  memo,
  chainId,
  accountNumber,
  timeoutHeight,
  sequence,
  gas,
  msgs,
}: {
  memo?: string
  chainId: ChainId
  timeoutHeight?: string
  accountNumber: number
  sequence: number
  gas?: string
  msgs: Msgs[]
}) => ({
  chain_id: chainId,
  timeout_height: timeoutHeight || '',
  account_number: accountNumber.toString(),
  sequence: sequence.toString(),
  fee: getStdFee(gas),
  msgs: msgs.map((m) => m.toEip712()),
  memo: memo || '',
})
