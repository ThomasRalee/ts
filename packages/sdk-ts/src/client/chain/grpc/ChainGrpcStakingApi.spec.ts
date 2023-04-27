import { getNetworkEndpoints, Network } from '@thomasralee/networks'
import { mockFactory } from '@thomasralee/test-utils'
import { ChainGrpcStakingApi } from './ChainGrpcStakingApi'
import { ChainGrpcStakingTransformer } from '../transformers'
import { Delegation, Validator } from '../types'

const { injectiveAddress } = mockFactory
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)

describe('chainGrpcStakingApi', () => {
  let validator: Validator
  let delegation: Delegation

  beforeAll(
    async () =>
      new Promise<void>(async (resolve) => {
        const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc)

        const { validators } = await chainGrpcStakingApi.fetchValidators()

        validator = validators[0]

        const { delegations } =
          await chainGrpcStakingApi.fetchValidatorDelegations({
            validatorAddress: validator.operatorAddress,
            pagination: { limit: 1 },
          })

        delegation = delegations[0]

        return resolve()
      }),
  )

  it('fetchModuleParams', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchModuleParams()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.moduleParamsResponseToModuleParams
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchModuleParams => ${(e as any).message}`,
      )
    }
  })

  it('fetchPool', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchPool()

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<typeof ChainGrpcStakingTransformer.poolResponseToPool>
        >(response),
      )
    } catch (e) {
      console.error(`ChainGrpcStakingApi.fetchPool => ${(e as any).message}`)
    }
  })

  it('fetchValidators', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchValidators()

      if (response.validators.length === 0) {
        console.warn('fetchValidators.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.validatorsResponseToValidators
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchValidators => ${(e as any).message}`,
      )
    }
  })

  it('fetchValidator', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchValidator(
        validator.operatorAddress,
      )

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.validatorResponseToValidator
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchValidator => ${(e as any).message}`,
      )
    }
  })

  it('fetchValidatorDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchValidatorDelegations({
        validatorAddress: validator.operatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchValidatorDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchValidatorDelegations => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchValidatorDelegationsNoThrow', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchValidatorDelegationsNoThrow({
          validatorAddress: validator.operatorAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.delegations.length === 0) {
        console.warn('fetchValidatorDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchValidatorDelegationsNoThrow => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchValidatorUnbondingDelegations', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchValidatorUnbondingDelegations({
          validatorAddress: validator.operatorAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchValidatorUnbondingDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchValidatorUnbondingDelegations => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchValidatorUnbondingDelegationsNoThrow', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchValidatorUnbondingDelegationsNoThrow({
          validatorAddress: validator.operatorAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchValidatorUnbondingDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchValidatorUnbondingDelegationsNoThrow => ${
          (e as any).message
        }`,
      )
    }
  })

  it.skip('fetchDelegation', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegation({
        injectiveAddress: delegation.delegation.delegatorAddress,
        validatorAddress: validator.operatorAddress,
      })

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationResponseToDelegation
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchDelegation => ${(e as any).message}`,
      )
    }
  })

  it('fetchDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegations({
        injectiveAddress: delegation.delegation.delegatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchDelegations => ${(e as any).message}`,
      )
    }
  })

  it('fetchDelegationsNoThrow', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegationsNoThrow({
        injectiveAddress: delegation.delegation.delegatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchDelegationsNoThrow => ${(e as any).message}`,
      )
    }
  })

  it('fetchDelegators', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegators({
        validatorAddress: validator.operatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegators.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchDelegators => ${(e as any).message}`,
      )
    }
  })

  it('fetchDelegatorsNoThrow', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchDelegatorsNoThrow({
        validatorAddress: validator.operatorAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.delegations.length === 0) {
        console.warn('fetchDelegatorsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.delegationsResponseToDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchDelegatorsNoThrow => ${(e as any).message}`,
      )
    }
  })

  it('fetchUnbondingDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchUnbondingDelegations({
        injectiveAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchUnbondingDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchUnbondingDelegations => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchUnbondingDelegationsNoThrow', async () => {
    try {
      const response =
        await chainGrpcStakingApi.fetchUnbondingDelegationsNoThrow({
          injectiveAddress,
          pagination: {
            limit: 1,
          },
        })

      if (response.unbondingDelegations.length === 0) {
        console.warn('fetchUnbondingDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.unBondingDelegationsResponseToUnBondingDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchUnbondingDelegationsNoThrow => ${
          (e as any).message
        }`,
      )
    }
  })

  it('fetchReDelegations', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchReDelegations({
        injectiveAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.redelegations.length === 0) {
        console.warn('fetchReDelegations.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchReDelegations => ${(e as any).message}`,
      )
    }
  })

  it('fetchReDelegationsNoThrow', async () => {
    try {
      const response = await chainGrpcStakingApi.fetchReDelegationsNoThrow({
        injectiveAddress,
        pagination: {
          limit: 1,
        },
      })

      if (response.redelegations.length === 0) {
        console.warn('fetchReDelegationsNoThrow.arrayIsEmpty')
      }

      expect(response).toBeDefined()
      expect(response).toStrictEqual(
        expect.objectContaining<
          ReturnType<
            typeof ChainGrpcStakingTransformer.reDelegationsResponseToReDelegations
          >
        >(response),
      )
    } catch (e) {
      console.error(
        `ChainGrpcStakingApi.fetchReDelegationsNoThrow => ${
          (e as any).message
        }`,
      )
    }
  })
})
