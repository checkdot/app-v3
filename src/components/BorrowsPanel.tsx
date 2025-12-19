"use client"

import { SUPPORTED_CHAINS } from "@/constants"
import useAccountLendingInfo from "@/hooks/useAccountLendingInfo"
import useTotalLendingInfo from "@/hooks/useTotalLendingInfo"
import usePrices from "@/hooks/usePrices"
import { formatNumberUnit, getTokenImage } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import { formatUnits } from "viem"
import { useChainId } from "wagmi"

interface BorrowsPanelProps {
  onSelectAsset: (token: `0x${string}`) => void
  className?: string
}

const BorrowsPanel = ({ onSelectAsset, className }: BorrowsPanelProps) => {
  const { borrows } = useAccountLendingInfo()
  const { borrowRates, decimals, symbols } = useTotalLendingInfo()
  const prices = usePrices()
  const chainId = useChainId()

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const availBorrows = Object.entries(borrows ?? {}).filter(
    ([_, balance]) => balance > 0n
  )

  return (
    <div className={`bg-white dark:bg-[#080811] py-6 ${className}`}>
      <h2 className="text-xl font-bold px-6">Your Borrows</h2>
      {availBorrows.length > 0 ? (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mt-6">
          <div className="w-full min-w-[600px]">
            <div className="flex rounded-xl py-2.5 px-6 border-b border-b-[#afafaf7a] dark:border-b-[#d2d2d212]">
              <div className="flex-1 min-w-[120px] sm:min-w-[160px] sticky left-0 z-10 pr-2 bg-white dark:bg-[#080811] pl-6 -ml-6">
                <span>Asset</span>
              </div>
              <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                <span>Balance</span>
              </div>
              <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                <span>APR</span>
              </div>
              <div className="flex-1 min-w-[160px] sm:min-w-[200px] text-center">
                <span></span>
              </div>
            </div>
            {availBorrows.map(([token, balance]) => {
              return (
                <div
                  key={token}
                  className="flex items-center  px-6 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150 border-b border-b-[#afafaf7a] dark:border-b-[#d2d2d212]"
                >
                  <div className="flex-1 min-w-[120px] sm:min-w-[160px] sticky left-0 z-10 pr-2 bg-white dark:bg-[#080811] pl-6 -ml-6 py-2.5">
                    <div className="flex items-center">
                      <Image
                        src={getTokenImage(chainId, token as `0x${string}`)}
                        alt={token ?? ""}
                        width={100}
                        height={100}
                        className="rounded-full size-8 mr-2"
                      />
                      <div className="flex flex-col">
                        <span>
                          {symbols?.[token.toLowerCase() as `0x${string}`] ??
                            ""}
                        </span>
                        <span className="text-sm font-normal opacity-50">
                          $
                          {Number(
                            formatUnits(
                              prices?.[token.toLowerCase() as `0x${string}`] ??
                                0n,
                              18 -
                                ((decimals?.[
                                  token.toLowerCase() as `0x${string}`
                                ] ?? 18) -
                                  (chain?.precision ?? 18))
                            )
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                    <span>
                      {formatNumberUnit(
                        Number(
                          formatUnits(
                            balance,
                            decimals?.[token.toLowerCase() as `0x${string}`] ??
                              18
                          )
                        )
                      )}{" "}
                      {symbols?.[token.toLowerCase() as `0x${string}`] ?? ""}
                    </span>
                  </div>
                  <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                    <span>
                      {(
                        Number(
                          formatUnits(
                            borrowRates?.[
                              token.toLowerCase() as `0x${string}`
                            ] ?? 0n,
                            18
                          )
                        ) * 100
                      ).toFixed(2)}{" "}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-end space-x-2 flex-1 min-w-[160px] sm:min-w-[200px] text-center">
                    <a
                      onClick={() => onSelectAsset(token as `0x${string}`)}
                      className="text-sm border text-black border-[#33f693] hover:bg-transparent bg-[#33f693] hover:text-black dark:hover:text-[#eee] transition-all duration-150 cursor-pointer py-1.5 px-2 sm:px-3"
                    >
                      Repay
                    </a>
                    <Link
                      href={`details/${token.toLowerCase() as `0x${string}`}`}
                      className="text-sm border text-[#0f59d1] dark:text-[#eee] border-[#d0d7df] dark:border-[#eee] hover:bg-[#0f59d1] dark:hover:bg-[#eee] bg-[#f8f9fd] dark:bg-transparent hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150 cursor-pointer py-1.5 px-2 sm:px-3"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-sm opacity-50 px-6 mt-6">No borrows yet</div>
      )}
    </div>
  )
}

export default BorrowsPanel
