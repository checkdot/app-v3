import lendingAbi from "@/abi/lendingAbi"
import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "@/constants"
import { formatUnits } from "viem"
import { useChainId, useReadContracts } from "wagmi"

const usePrices = () => {
  const chainId = useChainId()

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data } = useReadContracts({
    contracts: SUPPORTED_ASSETS.map((asset) => ({
      address: chain?.lending as `0x${string}`,
      abi: lendingAbi,
      functionName: "getTokenPrice",
      args: [asset.addresses[chainId] as `0x${string}`],
    })),
    query: {
      select: (data) => {
        let prices: Record<string, bigint> = {}
        SUPPORTED_ASSETS.forEach((asset, index) => {
          prices[asset.symbol] = (data?.[index]?.result ?? 0n) as bigint
        })
        return prices
      },
      enabled: !!chainId,
    },
  })

  return data
}

export default usePrices
