import { uint8ArrayToString } from '../../../utils'
import {
  GovModuleStateParams,
  Proposal,
  GrpcProposal,
  ProposalDeposit,
  Vote,
  TallyResult,
  GrpcTallyResult,
  GrpcGovernanceDepositParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceTallyParams,
} from '../types/gov'
import { Pagination } from '../../../types/index'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import { cosmosSdkDecToBigNumber } from '../../../utils'
import { CosmosGovV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcGovTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosGovV1Beta1Query.QueryParamsResponse,
  ): GovModuleStateParams {
    const depositParams = response.depositParams!
    const votingParams = response.votingParams!
    const tallyParams = response.tallyParams!

    return {
      depositParams: {
        minDepositList: depositParams?.minDeposit,
        maxDepositPeriod: parseInt(
          depositParams?.maxDepositPeriod?.seconds || '0',
          10,
        ),
      },
      votingParams: {
        votingPeriod: parseInt(votingParams.votingPeriod?.seconds || '0'),
      },
      tallyParams: {
        quorum: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.quorum) as string,
        ).toFixed(),
        threshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.threshold) as string,
        ).toFixed(),
        vetoThreshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.vetoThreshold) as string,
        ).toFixed(),
      },
    }
  }

  static moduleParamsResponseToModuleParamsByType({
    depositParams,
    votingParams,
    tallyParams,
  }: {
    depositParams: GrpcGovernanceDepositParams
    votingParams: GrpcGovernanceVotingParams
    tallyParams: GrpcGovernanceTallyParams
  }): GovModuleStateParams {
    return {
      depositParams: {
        minDepositList: depositParams?.minDeposit,
        maxDepositPeriod: parseInt(
          depositParams?.maxDepositPeriod?.seconds || '0',
          10,
        ),
      },
      votingParams: {
        votingPeriod: parseInt(votingParams.votingPeriod?.seconds || '0'),
      },
      tallyParams: {
        quorum: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.quorum) as string,
        ).toFixed(),
        threshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.threshold) as string,
        ).toFixed(),
        vetoThreshold: cosmosSdkDecToBigNumber(
          uint8ArrayToString(tallyParams.vetoThreshold) as string,
        ).toFixed(),
      },
    }
  }

  static proposalResponseToProposal(
    response: CosmosGovV1Beta1Query.QueryProposalResponse,
  ): Proposal {
    const proposal = response.proposal!

    return ChainGrpcGovTransformer.grpcProposalToProposal(proposal)
  }

  static proposalsResponseToProposals(
    response: CosmosGovV1Beta1Query.QueryProposalsResponse,
  ): {
    proposals: Proposal[]
    pagination: Pagination
  } {
    const proposals = response.proposals.map((p) =>
      ChainGrpcGovTransformer.grpcProposalToProposal(p),
    )
    const pagination = response.pagination

    return {
      proposals: proposals,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static depositsResponseToDeposits(
    response: CosmosGovV1Beta1Query.QueryDepositsResponse,
  ): {
    deposits: ProposalDeposit[]
    pagination: Pagination
  } {
    const pagination = response.pagination
    const deposits = response.deposits.map((deposit) => {
      return {
        depositor: deposit.depositor,
        amounts: deposit.amount.map((coin) => ({
          denom: coin.denom,
          amount: cosmosSdkDecToBigNumber(coin.amount).toFixed(),
        })),
      }
    })

    return {
      deposits: deposits,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static votesResponseToVotes(
    response: CosmosGovV1Beta1Query.QueryVotesResponse,
  ): {
    votes: Vote[]
    pagination: Pagination
  } {
    const pagination = response.pagination
    const votes = response.votes.map((v) => {
      return {
        proposalId: v.proposalId,
        voter: v.voter,
        option: v.option,
      }
    })

    return {
      votes: votes.map((v) => ({
        ...v,
        proposalId: parseInt(v.proposalId, 10),
      })),
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static tallyResultResponseToTallyResult(
    response: CosmosGovV1Beta1Query.QueryTallyResultResponse,
  ): TallyResult {
    const result = response.tally

    return ChainGrpcGovTransformer.grpcTallyResultToTallyResult(result)
  }

  static grpcTallyResultToTallyResult(
    result: GrpcTallyResult | undefined,
  ): TallyResult {
    return {
      yes: result ? result.yes : '0',
      abstain: result ? result.abstain : '0',
      no: result ? result.no : '0',
      noWithVeto: result ? result.noWithVeto : '0',
    }
  }

  static grpcProposalToProposal(proposal: GrpcProposal): Proposal {
    const finalTallyResult = proposal.finalTallyResult
    const content = proposal.content!

    return {
      proposalId: parseInt(proposal.proposalId, 10),
      content: {
        type: content.typeUrl,
        value: content.value,
      },
      type: content.typeUrl,
      submitTime: Math.floor(proposal.submitTime!.getTime() / 1000),
      status: proposal.status,
      finalTallyResult:
        ChainGrpcGovTransformer.grpcTallyResultToTallyResult(finalTallyResult),
      depositEndTime: Math.floor(proposal.depositEndTime!.getTime() / 1000),
      totalDeposits: proposal.totalDeposit.map((coin) => ({
        denom: coin.denom,
        amount: cosmosSdkDecToBigNumber(coin.amount).toFixed(),
      })),
      votingStartTime: Math.floor(proposal.votingStartTime!.getTime() / 1000),
      votingEndTime: Math.floor(proposal.votingEndTime!.getTime() / 1000),
    }
  }
}
