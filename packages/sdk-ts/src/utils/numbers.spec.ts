import {
  spotPriceFromChainPriceToFixed,
  spotQuantityFromChainQuantityToFixed,
} from './numbers'

describe('formatSpotChainNumbersToProperFormat', () => {
  it('formats the number properly', () => {
    expect(
      spotQuantityFromChainQuantityToFixed({
        value: '3000000000000000000000',
        baseDecimals: 18,
      }),
    ).toStrictEqual('3000')
    expect(
      spotPriceFromChainPriceToFixed({
        value: '0.000000000001437',
        quoteDecimals: 6,
        baseDecimals: 18,
      }),
    ).toStrictEqual('1.437')
  })
})
