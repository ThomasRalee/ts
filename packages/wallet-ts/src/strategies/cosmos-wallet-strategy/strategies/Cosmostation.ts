/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@thomasralee/ts-types'
import {
  ErrorType,
  TransactionException,
  UnspecifiedErrorCode,
  CosmosWalletException,
} from '@thomasralee/exceptions'
import {
  TxResponse,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@thomasralee/sdk-ts'
import { DirectSignResponse, makeSignDoc } from '@cosmjs/proto-signing'
import { cosmos, InstallError, Cosmos } from '@cosmostation/extension-client'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos'
import { AminoSignResponse, StdSignDoc } from '@keplr-wallet/types'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { CosmosTxV1Beta1Tx } from '@thomasralee/sdk-ts'

const getChainNameFromChainId = (chainId: CosmosChainId) => {
  const [chainName] = chainId.split('-')

  if (chainName.includes('cosmoshub')) {
    return 'cosmos'
  }

  if (chainName.includes('core')) {
    return 'persistence'
  }

  if (chainName.includes('evmos')) {
    return 'evmos'
  }

  return chainName
}

export default class Cosmostation implements ConcreteCosmosWalletStrategy {
  public chainName: string

  public provider?: Cosmos

  public chainId: CosmosChainId

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId
    this.chainName = getChainNameFromChainId(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async isChainIdSupported(chainId?: CosmosChainId): Promise<boolean> {
    const actualChainId = chainId || this.chainId
    const provider = await this.getProvider()

    const supportedChainIds = await provider.getSupportedChainIds()

    return !!supportedChainIds.official.find(
      (chainId) => chainId === actualChainId,
    )
  }

  async getAddresses(): Promise<string[]> {
    const { chainName } = this
    const provider = await this.getProvider()

    try {
      const accounts = await provider.requestAccount(chainName)

      return [accounts.address]
    } catch (e: unknown) {
      if ((e as any).code === 4001) {
        throw new CosmosWalletException(
          new Error('The user rejected the request'),
          {
            code: UnspecifiedErrorCode,
            context: WalletAction.GetAccounts,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(
    transaction: DirectSignResponse | CosmosTxV1Beta1Tx.TxRaw,
  ): Promise<TxResponse> {
    const { chainName } = this
    const provider = await this.getProvider()
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      const response = await provider.sendTransaction(
        chainName,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        SEND_TRANSACTION_MODE.ASYNC,
      )

      return {
        ...response.tx_response,
        gasUsed: parseInt((response.tx_response.gas_used || '0') as string, 10),
        gasWanted: parseInt(
          (response.tx_response.gas_wanted || '0') as string,
          10,
        ),
        height: parseInt((response.tx_response.height || '0') as string, 10),
        txHash: response.tx_response.txhash as string,
        rawLog: response.tx_response.raw_log as string,
      } as TxResponse
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signTransaction(transaction: {
    txRaw: CosmosTxV1Beta1Tx.TxRaw
    accountNumber: number
    chainId: string
  }) {
    const { chainName, chainId } = this
    const provider = await this.getProvider()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      /* Sign the transaction */
      const signDirectResponse = await provider.signDirect(
        chainName,
        {
          chain_id: chainId,
          body_bytes: signDoc.bodyBytes,
          auth_info_bytes: signDoc.authInfoBytes,
          account_number: transaction.accountNumber.toString(),
        },
        { fee: true, memo: true },
      )

      return {
        signed: makeSignDoc(
          signDirectResponse.signed_doc.body_bytes,
          signDirectResponse.signed_doc.auth_info_bytes,
          signDirectResponse.signed_doc.chain_id,
          parseInt(signDirectResponse.signed_doc.account_number, 10),
        ),
        signature: {
          signature: signDirectResponse.signature,
        },
      } as DirectSignResponse
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signAminoTransaction(_transaction: {
    address: string
    stdSignDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new CosmosWalletException(
      new Error('signAminoTransaction not supported on Cosmostation'),
    )
  }

  async getPubKey(): Promise<string> {
    const { chainName } = this
    const provider = await this.getProvider()

    try {
      const account = await provider.requestAccount(chainName)

      return Buffer.from(account.publicKey).toString('base64')
    } catch (e: unknown) {
      if ((e as any).code === 4001) {
        throw new CosmosWalletException(
          new Error('The user rejected the request'),
          {
            code: UnspecifiedErrorCode,
            context: WalletAction.GetAccounts,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private async getProvider(): Promise<Cosmos> {
    if (this.provider) {
      return this.provider
    }

    try {
      const provider = await cosmos()

      this.provider = provider

      return provider
    } catch (e) {
      if (e instanceof InstallError) {
        throw new CosmosWalletException(
          new Error('Please install the Cosmostation extension'),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletNotInstalledError,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
      })
    }
  }
}
