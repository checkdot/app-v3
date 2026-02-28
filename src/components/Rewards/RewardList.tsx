"use client"

// import { useQuery } from "@tanstack/react-query"
import RewardItem from "./RewardItem"
// import axios from "axios"
// import { useAccount } from "wagmi"

const RewardList = () => {
  //   const { address } = useAccount()

  //   const { data: rewardsBoost } = useQuery({
  //     queryKey: ["rewards-boost"],
  //     queryFn: async () => {
  //       const { data } = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/rewards_boost`
  //       )
  //       return data.data
  //     },
  //     refetchInterval: 12000,
  //   })

  //   const { data: rewards } = useQuery({
  //     queryKey: ["rewards", address],
  //     queryFn: async () => {
  //       const { data } = await axios.get(
  //         `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${address}`
  //       )
  //       return data.data
  //     },
  //     enabled: !!address,
  //     refetchInterval: 12000,
  //   })

  const rewardsBoost = [
    {
      type: "deposit",
      chain: 1,
      symbol: "CDT",
      decimals: 18,
      tokenAddress: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
      totalReward: {
        chain: 1,
        symbol: "ETH",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        quantity: 1000000000000000000n,
        decimals: 18,
      },
      startDate: 1764824400000,
      endDate: 1765429200000,
      distributedRewards: [],
    },
    {
      type: "borrow",
      chain: 56,
      symbol: "USDC",
      decimals: 18,
      tokenAddress: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
      totalReward: {
        chain: 56,
        symbol: "CDT",
        tokenAddress: "0x0000000000000000000000000000000000000000",
        quantity: 50000000000000000000n,
        decimals: 18,
      },
      startDate: 1764824400000,
      endDate: 1765429200000,
      distributedRewards: [],
    },
  ]

  const rewards = [
    {
      chain: 1,
      symbol: "ETH",
      amount: 1000000000000000000n,
      date: 1765429100000,
      hash: undefined,
    },
    {
      chain: 56,
      symbol: "CDT",
      amount: 10000000000000000000n,
      date: 1765429100000,
      hash: undefined,
    },
    {
      chain: 56,
      symbol: "CDT",
      amount: 100000000000000000000n,
      date: 1765429200000,
      hash: undefined,
    },
  ]

  return (
    <div className="flex flex-col gap-4 px-6">
      {rewardsBoost?.map((reward: any, index: number) => (
        <RewardItem
          key={index}
          pool={reward}
          rewards={rewards?.filter(
            (item: any) =>
              item.chain === reward.totalReward.chain &&
              item.symbol === reward.totalReward.symbol &&
              item.date > reward.startDate &&
              item.date <= reward.endDate &&
              item.hash === undefined
          )}
        />
      ))}
    </div>
  )
}

export default RewardList
