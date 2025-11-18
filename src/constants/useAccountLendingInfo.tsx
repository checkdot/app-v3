import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi"
import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "."
import lendingAbi from "@/abi/lendingAbi"

const useAccountLendingInfo = () => {
  const chainId = useChainId()
  const { address } = useAccount()
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data: totalCollateral } = useReadContract({
    address: chain?.lending as `0x${string}`,
    abi: lendingAbi,
    functionName: "getBorrowCapacity",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
      refetchInterval: 1000,
    },
  })

  const { data: totalBorrowed } = useReadContract({
    address: chain?.lending as `0x${string}`,
    abi: lendingAbi,
    functionName: "getTotalDebtUSD",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
      refetchInterval: 1000,
    },
  })

  const { data: deposits } = useReadContracts({
    contracts: SUPPORTED_ASSETS.map((asset) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "userCollateral",
      args: [
        address as `0x${string}`,
        asset.addresses[chainId] as `0x${string}`,
      ],
    })),
    query: {
      select: (data) => {
        let collateral: Record<string, bigint> = {}
        SUPPORTED_ASSETS.forEach((asset, index) => {
          collateral[asset.symbol] = (data?.[index]?.result ?? 0n) as bigint
        })
        return collateral
      },
      enabled: !!address && !!chainId,
      refetchInterval: 1000,
    },
  })

  const { data: borrows } = useReadContracts({
    contracts: SUPPORTED_ASSETS.map((asset) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "userDebt",
      args: [
        address as `0x${string}`,
        asset.addresses[chainId] as `0x${string}`,
      ],
    })),
    query: {
      select: (data) => {
        let borrows: Record<string, bigint> = {}
        SUPPORTED_ASSETS.forEach((asset, index) => {
          borrows[asset.symbol] = ((data?.[index]?.result as any)?.[0] ??
            0n) as bigint
        })
        return borrows
      },
      enabled: !!address && !!chainId,
      refetchInterval: 1000,
    },
  })

  return { totalBorrowed, totalCollateral, deposits, borrows }
}

export default useAccountLendingInfo
