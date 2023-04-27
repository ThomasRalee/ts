import { ChainId, EthereumChainId } from '@thomasralee/ts-types'
import { WalletStrategyArguments } from '../../types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected ethereumChainId?: EthereumChainId

  protected constructor({ chainId, ethereumOptions }: WalletStrategyArguments) {
    this.ethereumChainId = ethereumOptions
      ? ethereumOptions.ethereumChainId
      : undefined
    this.chainId = chainId
  }
}
