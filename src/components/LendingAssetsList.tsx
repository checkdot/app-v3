import Image from "next/image"
import LendingModal from "./LendingModal"
import { useState } from "react"
import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "@/constants"
import { formatNumberUnit } from "@/utils"
import usePrices from "@/hooks/usePrices"
import useTotalLendingInfo from "@/constants/useTotalLendingInfo"
import { formatUnits } from "viem"
import { useChainId } from "wagmi"
import useAccountLendingInfo from "@/constants/useAccountLendingInfo"

const LendingAssetsList = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const chainId = useChainId()

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)
  const prices = usePrices()
  const { reserves, deposits, borrows, utilizations, borrowRates } =
    useTotalLendingInfo()
  const { totalBorrowed, totalCollateral } = useAccountLendingInfo()

  const statements = [
    {
      label: "Supported Assets",
      value: SUPPORTED_ASSETS.length,
    },
    {
      label: "Total Reserves",
      value: `$${formatNumberUnit(
        Number(
          SUPPORTED_ASSETS.reduce(
            (acc, asset) =>
              acc +
              Number(
                formatUnits(
                  reserves?.[asset.symbol] ?? 0n,
                  asset.decimals?.[chainId] ?? 18
                )
              ) *
                Number(
                  formatUnits(
                    prices?.[asset.symbol] ?? 0n,
                    18 -
                      ((asset?.decimals?.[chainId] ?? 18) -
                        (chain?.precision ?? 18))
                  )
                ),
            0
          )
        )
      )}`,
    },
    {
      label: "Total Deposits",
      value: `$${formatNumberUnit(
        Number(
          SUPPORTED_ASSETS.reduce(
            (acc, asset) =>
              acc +
              Number(
                formatUnits(
                  deposits?.[asset.symbol] ?? 0n,
                  asset.decimals?.[chainId] ?? 18
                )
              ) *
                Number(
                  formatUnits(
                    prices?.[asset.symbol] ?? 0n,
                    18 -
                      ((asset?.decimals?.[chainId] ?? 18) -
                        (chain?.precision ?? 18))
                  )
                ),
            0
          )
        )
      )}`,
    },
    {
      label: "Total Borrows",
      value: `$${formatNumberUnit(
        Number(
          SUPPORTED_ASSETS.reduce(
            (acc, asset) =>
              acc +
              Number(
                formatUnits(
                  borrows?.[asset.symbol] ?? 0n,
                  asset.decimals?.[chainId] ?? 18
                )
              ) *
                Number(
                  formatUnits(
                    prices?.[asset.symbol] ?? 0n,
                    18 -
                      ((asset?.decimals?.[chainId] ?? 18) -
                        (chain?.precision ?? 18))
                  )
                ),
            0
          )
        )
      )}`,
    },
  ]

  const yourStatements = [
    {
      label: "Your Borrows",
      value: `$${formatNumberUnit(Number(formatUnits(totalBorrowed ?? 0n, 18)))}`,
    },
    {
      label: "Your Deposits",
      value: `$${formatNumberUnit(Number(formatUnits(totalCollateral ?? 0n, 18)))}`,
    },
  ]

  return (
    <>
      <div>
        <div className="flex flex-wrap">
          {statements.map((item) => (
            <div key={item.label} className="p-2 w-full sm:w-1/2 md:w-1/4">
              <div className="p-4 bg-white dark:bg-[#080811]">
                <div className="text-center">{item.label}</div>
                <div className="text-center text-[#33f693] text-2xl font-bold">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap">
          {yourStatements.map((item) => (
            <div key={item.label} className="p-2 w-full sm:w-1/2">
              <div className="p-4 bg-white dark:bg-[#080811]">
                <div className="text-center">{item.label}</div>
                <div className="text-center text-[#33f693] text-2xl font-bold">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full min-w-[800px]">
            <div className="flex rounded-xl bg-white dark:bg-[#080811] pt-2.5 pb-0.5 px-2 my-2">
              <div className="flex-2 min-w-[180px] sm:min-w-[200px] sticky left-0 z-10 bg-white dark:bg-[#080811] pr-2">
                <span className="text-sm sm:text-base">Asset</span>
              </div>
              <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                <span className="text-sm sm:text-base">Reserves</span>
              </div>
              <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                <span className="text-sm sm:text-base">Deposits</span>
              </div>
              <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                <span className="text-sm sm:text-base">Deposit APR</span>
              </div>
              <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                <span className="text-sm sm:text-base">Borrows</span>
              </div>
              <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                <span className="text-sm sm:text-base">Borrow APR</span>
              </div>
              <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                <span className="text-sm sm:text-base">Weight</span>
              </div>
              <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                <span className="text-sm sm:text-base">Details</span>
              </div>
            </div>
            {SUPPORTED_ASSETS.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center rounded-xl bg-white dark:bg-[#080811] p-2 my-2 hover:brightness-125 transition-all duration-150"
              >
                <div className="flex-2 min-w-[180px] sm:min-w-[200px] sticky left-0 z-10 bg-white dark:bg-[#080811] pr-2">
                  <div className="flex items-center">
                    <Image
                      src={asset.image}
                      alt={asset.symbol}
                      width={100}
                      height={100}
                      className="rounded-full size-8 mr-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base">
                        {asset.symbol}
                      </span>
                      <span className="text-xs sm:text-sm font-normal opacity-50">
                        $
                        {Number(
                          formatUnits(
                            prices?.[asset.symbol] ?? 0n,
                            18 -
                              ((asset.decimals?.[chainId] ?? 18) -
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
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="text-sm sm:text-base">
                    {formatNumberUnit(
                      Number(
                        formatUnits(
                          reserves?.[asset.symbol] ?? 0n,
                          asset.decimals?.[chainId] ?? 18
                        )
                      )
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="text-sm sm:text-base">
                    {formatNumberUnit(
                      Number(
                        formatUnits(
                          deposits?.[asset.symbol] ?? 0n,
                          asset.decimals?.[chainId] ?? 18
                        )
                      )
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="text-sm sm:text-base">
                    {(
                      Number(
                        formatUnits(
                          ((borrowRates?.[asset.symbol] ?? 0n) *
                            (utilizations?.[asset.symbol] ?? 0n)) /
                            BigInt(1e18),
                          18
                        )
                      ) * 100
                    ).toFixed(2)}{" "}
                    %
                  </span>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="text-sm sm:text-base">
                    {formatNumberUnit(
                      Number(
                        formatUnits(
                          borrows?.[asset.symbol] ?? 0n,
                          asset.decimals?.[chainId] ?? 18
                        )
                      )
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-[100px] sm:min-w-[120px] text-center">
                  <span className="text-sm sm:text-base">
                    {(
                      Number(
                        formatUnits(borrowRates?.[asset.symbol] ?? 0n, 18)
                      ) * 100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
                <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                  <span className="text-sm sm:text-base">{asset.weight}</span>
                </div>
                <div className="flex-1 min-w-[80px] sm:min-w-[100px] text-center">
                  <a className="text-xs sm:text-sm border text-[#0f59d1] dark:text-[#eee] border-[#d0d7df] dark:border-[#eee] hover:bg-[#0f59d1] dark:hover:bg-[#eee] bg-[#f8f9fd] dark:bg-transparent hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150 cursor-pointer py-0.5 px-2 sm:px-3">
                    <button onClick={() => setSelectedAsset(asset.symbol)}>
                      Details
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <LendingModal
        symbol={selectedAsset ?? ""}
        open={selectedAsset !== null}
        onClose={() => setSelectedAsset(null)}
      />
    </>
  )
}

export default LendingAssetsList
