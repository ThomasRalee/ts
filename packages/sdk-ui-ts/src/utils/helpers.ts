import path from 'path'
import { TokenType } from '@thomasralee/token-metadata'
import { validatorAddressToPathMap } from './mappings'
// @ts-ignore
import validatorToAddressMapFromKeybase from '../validators-logo/mappings.json'

export const getTokenLogoWithVendorPathPrefix = (image: string) => {
  if (image.includes('@thomasralee')) {
    return image
  }

  if (image.includes('http')) {
    return image
  }

  if (image.includes('bridgingNetworks')) {
    return image
  }

  return path.join('/', 'vendor', '@thomasralee', 'token-metadata', image)
}

export const getTokenLogoFromTokenType = (tokenType: TokenType) => {
  switch (true) {
    case tokenType === TokenType.InsuranceFund:
      return getTokenLogoWithVendorPathPrefix('insurance-fund.svg')
    case tokenType === TokenType.Native:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.svg')
    case tokenType === TokenType.Cw20:
      return getTokenLogoWithVendorPathPrefix('cw20.svg')
    case tokenType === TokenType.Ibc:
      return getTokenLogoWithVendorPathPrefix('ibc.svg')
    default:
      return getTokenLogoWithVendorPathPrefix('injective-black-fill.svg')
  }
}

export const getValidatorLogoWithVendorPathPrefix = (
  validatorAddress: string,
) => {
  const validatorToAddressFromKeybaseMap = JSON.parse(
    JSON.stringify(validatorToAddressMapFromKeybase),
  )

  const validatorLogoPath = validatorToAddressFromKeybaseMap[validatorAddress]
    ? validatorToAddressFromKeybaseMap[validatorAddress]
    : validatorAddressToPathMap[validatorAddress]

  return path.join(
    '/',
    'vendor',
    '@thomasralee',
    'sdk-ui-ts',
    validatorLogoPath ? validatorLogoPath : 'injective.webp',
  )
}
