import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import { getEthereumAddress, getInjectiveAddress } from '../../../../utils'

export const createAnyMessage = (msg: { type: string; value: any }) => {
  const message = Any.create()
  message.typeUrl = `${msg.type.startsWith('/') ? '' : '/'}${msg.type}`
  message.value = msg.value.serializeBinary()

  return message
}

export const createAny = (value: any, type: string) => {
  const message = Any.create()
  message.typeUrl = type
  message.value = value

  return message
}

export const getInjectiveSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('inj')) {
    return address
  }

  if (address.startsWith('0x')) {
    return getInjectiveAddress(address)
  }

  return ''
}

export const getEthereumSignerAddress = (address: string | undefined) => {
  if (!address) {
    return ''
  }

  if (address.startsWith('0x')) {
    return address
  }

  if (address.startsWith('inj')) {
    return getEthereumAddress(address)
  }

  return ''
}
