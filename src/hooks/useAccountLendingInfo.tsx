import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi"
import { SUPPORTED_CHAINS } from "../constants"
import lendingAbi from "@/abi/lendingAbi"
import { erc20Abi, zeroAddress } from "viem"
import useTotalLendingInfo from "./useTotalLendingInfo"

const useAccountLendingInfo = () => {
  const chainId = useChainId()
  const { address } = useAccount()
  const { supportedTokens } = useTotalLendingInfo()
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data: balances } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: token,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    })),
    query: {
      select: (data) => {
        let balances: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          balances[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return balances
      },
      enabled: !!address && !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: nativeBalance } = useBalance({
    address: address as `0x${string}`,
    chainId: chainId as any,
    query: {
      enabled: !!address && !!chainId,
      refetchInterval: 12000,
    },
  })

  const { data: totalCollateral } = useReadContract({
    address: chain?.lending as `0x${string}`,
    abi: lendingAbi,
    functionName: "getBorrowCapacity",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
      refetchInterval: 12000,
    },
  })

  const { data: totalBorrowed } = useReadContract({
    address: chain?.lending as `0x${string}`,
    abi: lendingAbi,
    functionName: "getTotalDebtUSD",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!chainId,
      refetchInterval: 12000,
    },
  })

  const { data: deposits } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "userCollateral",
      args: [address as `0x${string}`, token],
    })),
    query: {
      select: (data) => {
        let collateral: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          collateral[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return collateral
      },
      enabled: !!address && !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  const { data: borrows } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "getUserDebtAmount",
      args: [address as `0x${string}`, token],
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
      enabled: !!address && !!chainId && !!supportedTokens,
      refetchInterval: 12000,
    },
  })

  return {
    totalBorrowed,
    totalCollateral,
    deposits,
    borrows,
    balances: {
      ...balances,
      [zeroAddress as `0x${string}`]: nativeBalance?.value ?? 0n,
    } as Record<`0x${string}`, bigint>,
  }
}

export default useAccountLendingInfo
