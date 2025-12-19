"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { formatUnits } from "viem"
import { useWalletClient } from "wagmi"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { getTokenImage } from "@/utils"

interface RewardItemProps {
  pool: any
  rewards: any
  className?: string
}

const RewardItem: React.FC<RewardItemProps> = ({
  pool,
  rewards,
  className,
}) => {
  const { data: walletClient } = useWalletClient()
  const [loading, setLoading] = useState(false)

  const claimableRewards =
    rewards?.reduce((acc: bigint, item: any) => acc + item.amount, 0n) ?? 0n

  const handleClaimRewards = async () => {
    if (!walletClient || !claimableRewards || claimableRewards.length === 0)
      return
    if (claimableRewards === 0n) return

    try {
      setLoading(true)

      const signature = await walletClient.signMessage({
        message: JSON.stringify({
          chainId: pool.totalReward.chain,
          symbol: pool.totalReward.symbol,
          amount: claimableRewards,
          to: walletClient.account.address,
        }),
      })

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rewards/${walletClient.account.address}/claim/${pool.totalReward.symbol}`,
        {
          chainId: pool.totalReward.chain,
          signature,
        }
      )
      console.log(data)
      if (data.success) {
        toast.success("Rewards claimed successfully")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Claim rewards failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`p-4 bg-white dark:bg-[#080811] rounded-xl ${className}`}>
      <div className="flex items-center flex-wrap justify-between">
        <div className="flex items-center">
          <Image
            src={
              getTokenImage(pool.chain, pool.tokenAddress as `0x${string}`) ??
              ""
            }
            alt={pool.tokenAddress ?? ""}
            width={100}
            height={100}
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-4">
            <h4 className="text-lg font-bold">{pool.symbol} Rewards</h4>
            <p className="text-sm opacity-60">
              By {pool.type === "borrow" ? "borrowing" : "depositing"}{" "}
              {pool.symbol}, you can earn rewards in {pool.totalReward.symbol}.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 max-md:order-2 max-md:mt-4">
          {claimableRewards > 0n && (
            <a
              onClick={handleClaimRewards}
              className={`text-sm border text-black border-[#33f693] hover:bg-transparent bg-[#33f693] hover:text-black dark:hover:text-[#eee] transition-all duration-150 cursor-pointer py-1.5 px-2 sm:px-3 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Claiming..." : "Claim Rewards"}
            </a>
          )}
          <Link
            href="/pools"
            className="text-sm border text-[#0f59d1] dark:text-[#eee] border-[#d0d7df] dark:border-[#eee] hover:bg-[#0f59d1] dark:hover:bg-[#eee] bg-[#f8f9fd] dark:bg-transparent hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150 cursor-pointer py-1.5 px-2 sm:px-3"
          >
            Deosit
          </Link>
        </div>
        <div className="flex max-md:flex-col items-center justify-between w-full mt-5">
          <div className="flex md:flex-col w-full max-md:justify-between items-center md:items-start md:border-r border-[#afafaf7a] dark:border-[#d2d2d212]">
            <span className="text-sm opacity-60">Period</span>
            <span className="font-bold mt-1">
              {format(pool.startDate, "MM/dd/yyyy")} -{" "}
              {format(pool.endDate, "MM/dd/yyyy")}
            </span>
          </div>
          <div className="flex md:flex-col items-center w-full max-md:justify-between md:border-r border-[#afafaf7a] dark:border-[#d2d2d212]">
            <span className="text-sm opacity-60">Total Rewards</span>
            <span className="font-bold mt-1">
              {formatUnits(
                pool.totalReward.quantity,
                pool.totalReward.decimals
              )}{" "}
              {pool.totalReward.symbol}
            </span>
          </div>
          <div className="flex md:flex-col items-center md:items-end w-full max-md:justify-between">
            <span className="text-sm opacity-60">Claimable Rewards</span>
            <span className="font-bold mt-1">
              {formatUnits(claimableRewards, pool.totalReward.decimals)}{" "}
              {pool.totalReward.symbol}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardItem
