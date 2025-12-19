import lendingAbi from "@/abi/lendingAbi"
import { SUPPORTED_CHAINS } from "../constants"
import { useChainId, useReadContract, useReadContracts } from "wagmi"
import { erc20Abi, zeroAddress } from "viem"

const useTotalLendingInfo = () => {
  const chainId = useChainId()
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data: supportedTokens } = useReadContract({
    address: chain?.lending as `0x${string}`,
    abi: lendingAbi,
    functionName: "getSupportedTokens",
    query: {
      enabled: !!chainId,
      refetchInterval: 12000,
    },
  })

  console.log(supportedTokens)

  const { data: symbols } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "symbol",
    })),
    query: {
      select: (data) => {
        let symbols: Record<`0x${string}`, string> = {}
        supportedTokens?.forEach((token, index) => {
          symbols[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? "") as string
        })
        return symbols
      },
      enabled: !!chainId && !!supportedTokens,
    },
  })

  const { data: decimals } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "decimals",
    })),
    query: {
      select: (data) => {
        let decimals: Record<`0x${string}`, number> = {}
        supportedTokens?.forEach((token, index) => {
          decimals[token.toLowerCase() as `0x${string}`] = Number(
            data?.[index]?.result ?? 0n
          )
        })
        return decimals
      },
      enabled: !!chainId && !!supportedTokens,
    },
  })

  const { data: weights } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "tokenConfigs",
      args: [token],
    })),
    query: {
      select: (data) => {
        let weights: Record<`0x${string}`, number> = {}
        supportedTokens?.forEach((token, index) => {
          weights[token.toLowerCase() as `0x${string}`] = Number(
            (data?.[index]?.result as any)?.[0] ?? 0n
          )
        })
        return weights
      },
      enabled: !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: reserves } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "reserves",
      args: [token],
    })),
    query: {
      select: (data) => {
        let reserves: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          reserves[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return reserves
      },
      enabled: !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: deposits } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "totalCollateralPerToken",
      args: [token],
    })),
    query: {
      select: (data) => {
        let deposits: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          deposits[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return deposits
      },
      enabled: !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: borrows } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "totalDebtPerToken",
      args: [token],
    })),
    query: {
      select: (data) => {
        let borrows: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          borrows[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return borrows
      },
      enabled: !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: utilizations } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "getUtilizationRate",
      args: [token],
    })),
    query: {
      select: (data) => {
        let utilizations: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          utilizations[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return utilizations
      },
      enabled: !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: borrowRates } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "getCurrentBorrowRate",
      args: [token],
    })),
    query: {
      select: (data) => {
        let borrowRates: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          borrowRates[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return borrowRates
      },
      enabled: !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  return {
    reserves,
    deposits,
    borrows,
    utilizations,
    borrowRates,
    supportedTokens,
    decimals: {
      ...decimals,
      [zeroAddress as `0x${string}`]: chain?.precision ?? 18,
    } as Record<`0x${string}`, number>,
    symbols: {
      ...symbols,
      [zeroAddress as `0x${string}`]: chain?.nativeCurrency ?? "ETH",
    } as Record<`0x${string}`, string>,
    weights,
  }
}

export default useTotalLendingInfo
