import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { WalletException } from '@thomasralee/exceptions'

export const getEthersProviderFromMetamask = async () => {
  try {
    const provider = await detectEthereumProvider({
      mustBeMetaMask: true,
    })

    if (!provider) {
      throw new WalletException(new Error('Please install Metamask Extension'))
    }

    return new ethers.providers.Web3Provider(provider)
  } catch (e) {
    throw new WalletException(new Error('Please install Metamask Extension'))
  }
}
