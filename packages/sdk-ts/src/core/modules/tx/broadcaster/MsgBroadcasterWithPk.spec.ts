import { Network } from '@thomasralee/networks'
import { PrivateKey } from '../../../accounts/PrivateKey'
import { MsgSend } from '../../bank'
import { MsgBroadcasterWithPk } from './MsgBroadcasterWithPk'

describe.skip('MsgBroadcasterWithPk', () => {
  test('prepares, simulates, signs and broadcasts a transaction', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
      simulateTx: true,
    }).broadcast({ msgs: message, injectiveAddress })

    expect(response.txHash).toBeDefined()
  }, 60000)
})
