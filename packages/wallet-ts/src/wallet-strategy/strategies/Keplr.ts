/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import {
  BigNumberInBase,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from '@injectivelabs/utils'
import Web3 from 'web3'
import { KeplrWallet } from '../../keplr'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'
import { CosmJsWallet } from '../../cosmos/CosmosWallet'
import { CosmosChainId } from '../../keplr/types'
import { createSignedTx } from '../../transaction'

export default class Keplr
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private keplrWallet: KeplrWallet

  private cosmosChainId: CosmosChainId

  constructor(args: {
    chainId: ChainId
    web3: Web3
    cosmosChainId?: CosmosChainId
  }) {
    super(args)
    this.cosmosChainId = args.cosmosChainId || CosmosChainId.Injective
    this.keplrWallet = new KeplrWallet(this.cosmosChainId)
  }

  async getAddresses(): Promise<string[]> {
    const { keplrWallet, cosmosChainId, chainId } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    if (chainId !== ChainId.Mainnet) {
      throw new Error('Keplr is only supported on Mainnet')
    }

    try {
      if (!KeplrWallet.checkChainIdSupport(cosmosChainId)) {
        await keplrWallet.experimentalSuggestChain()
      }

      const accounts = await keplrWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    const { keplrWallet } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    throw new Error(
      'sendEthereumTransaction is not supported. Keplr only supports sending cosmos transactions',
    )
  }

  async sendTransaction(
    signResponse: any,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    const { keplrWallet } = this
    const txRaw = createSignedTx(signResponse)

    try {
      return keplrWallet.broadcastTx(txRaw)
    } catch (e) {
      throw new Error((e as any).message)
    }
  }

  async signTransaction(
    transaction: any,
    address: AccountAddress,
  ): Promise<any> {
    const { keplrWallet, cosmosChainId } = this

    if (!keplrWallet) {
      throw new Web3Exception('Please install Keplr extension')
    }

    const endpoints = await keplrWallet.getChainEndpoints()
    const key = await keplrWallet.getKey()
    const signer = await keplrWallet.getOfflineSigner()
    const cosmWallet = new CosmJsWallet({
      ...endpoints,
      chainId: cosmosChainId,
      signer,
    })

    const fee = {
      amount: [
        {
          amount: new BigNumberInBase(DEFAULT_GAS_LIMIT)
            .times(DEFAULT_GAS_PRICE)
            .toString(),
          denom: 'inj',
        },
      ],
      gas: DEFAULT_GAS_LIMIT.toString(),
    }

    return cosmWallet.signTransaction({
      chainId: cosmosChainId,
      message: transaction.message,
      memo: transaction.memo,
      pubKey: Buffer.from(key.pubKey).toString('base64'),
      address,
      fee,
    })
  }

  async getNetworkId(): Promise<string> {
    throw new Error('getNetworkId is not supported on Keplr')
  }

  async getChainId(): Promise<string> {
    throw new Error('getChainId is not supported on Keplr')
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new Error('getEthereumTransactionReceipt is not supported on Keplr')
  }
}