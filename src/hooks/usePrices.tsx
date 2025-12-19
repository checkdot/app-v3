import lendingAbi from "@/abi/lendingAbi"
import { SUPPORTED_CHAINS } from "@/constants"
import { useChainId, useReadContracts } from "wagmi"
import useTotalLendingInfo from "./useTotalLendingInfo"

const usePrices = () => {
  const chainId = useChainId()
  const { supportedTokens } = useTotalLendingInfo()

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data } = useReadContracts({
    contracts: supportedTokens?.map((token) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "getTokenPrice",
      args: [token],
    })),
    query: {
      select: (data) => {
        let prices: Record<`0x${string}`, bigint> = {}
        supportedTokens?.forEach((token, index) => {
          prices[token.toLowerCase() as `0x${string}`] = (data?.[index]
            ?.result ?? 0n) as bigint
        })
        return prices
      },
      enabled: !!chainId && !!supportedTokens,
    },
  })

  return data
}

export default usePrices
