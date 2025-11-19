import lendingAbi from "@/abi/lendingAbi"
import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "."
import { useChainId, useReadContracts } from "wagmi"
import { formatUnits } from "viem"

const useTotalLendingInfo = () => {
  const chainId = useChainId()
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data: reserves } = useReadContracts({
    contracts: SUPPORTED_ASSETS.map((asset) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "reserves",
      args: [asset.addresses[chainId]],
    })),
    query: {
      select: (data) => {
        let reserves: Record<string, bigint> = {}
        SUPPORTED_ASSETS.forEach((asset, index) => {
          reserves[asset.symbol] = (data?.[index]?.result ?? 0n) as bigint
        })
        return reserves
      },
      enabled: !!chainId,
      refetchInterval: 12000,
    },
  })

  const { data: deposits } = useReadContracts({
    contracts: SUPPORTED_ASSETS.map((asset) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "totalCollateralPerToken",
      args: [asset.addresses[chainId] as `0x${string}`],
    })),
    query: {
      select: (data) => {
        let deposits: Record<string, bigint> = {}
        SUPPORTED_ASSETS.forEach((asset, index) => {
          deposits[asset.symbol] = (data?.[index]?.result ?? 0n) as bigint
        })
        return deposits
      },
      enabled: !!chainId,
      refetchInterval: 12000,
    },
  })

  const { data: borrows } = useReadContracts({
    contracts: SUPPORTED_ASSETS.map((asset) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "totalDebtPerToken",
      args: [asset.addresses[chainId] as `0x${string}`],
    })),
    query: {
      select: (data) => {
        let borrows: Record<string, bigint> = {}
        SUPPORTED_ASSETS.forEach((asset, index) => {
          borrows[asset.symbol] = (data?.[index]?.result ?? 0n) as bigint
        })
        return borrows
      },
      enabled: !!chainId,
      refetchInterval: 12000,
    },
  })

  return { reserves, deposits, borrows }
}

export default useTotalLendingInfo
