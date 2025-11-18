import Image from "next/image"
import LendingModal from "./LendingModal"
import { useState } from "react"
import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "@/constants"
import { formatNumberUnit } from "@/utils"
import usePrices from "@/hooks/usePrices"
import useTotalLendingInfo from "@/constants/useTotalLendingInfo"
import { formatUnits } from "viem"
import { useChainId } from "wagmi"

const LendingAssetsList = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const chainId = useChainId()

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)
  const prices = usePrices()
  const { reserves, deposits, borrows } = useTotalLendingInfo()

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
                Number(formatUnits(prices?.[asset.symbol] ?? 0n, 18)),
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
                Number(formatUnits(prices?.[asset.symbol] ?? 0n, 18)),
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
                Number(formatUnits(prices?.[asset.symbol] ?? 0n, 18)),
            0
          )
        )
      )}`,
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
        <div className="flex rounded-xl bg-white dark:bg-[#080811] pt-2.5 pb-0.5 px-2 my-2">
          <div className="min-w-[10%] w-full">
            <span>Asset</span>
          </div>
          <div className="min-w-[120px] text-center">
            <span>Reserves</span>
          </div>
          <div className="min-w-[120px] text-center">
            <span>Deposits</span>
          </div>
          <div className="min-w-[120px] text-center">
            <span>Borrows</span>
          </div>
          <div className="min-w-[120px] text-center">
            <span>Weight</span>
          </div>
          <div className="min-w-[80px] text-center">
            <span>Details</span>
          </div>
        </div>
        {SUPPORTED_ASSETS.map((asset) => (
          <div
            key={asset.symbol}
            className="flex items-center rounded-xl bg-white dark:bg-[#080811] p-2 my-2 hover:brightness-125 transition-all duration-150"
          >
            <div className="min-w-[10%] w-full">
              <div className="flex items-center">
                <Image
                  src={asset.image}
                  alt={asset.symbol}
                  width={100}
                  height={100}
                  className="rounded-full size-8 mr-2"
                />
                <div className="flex flex-col">
                  <span>{asset.symbol}</span>
                  <span className="text-sm font-normal opacity-50">
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
            <div className="min-w-[120px] text-center">
              <span>
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
            <div className="min-w-[120px] text-center">
              <span>
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
            <div className="min-w-[120px] text-center">
              <span>
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
            <div className="min-w-[120px] text-center">
              <span>{asset.weight}</span>
            </div>
            <div className="min-w-[80px] text-center">
              <a className="text-sm border text-[#0f59d1] dark:text-[#eee] border-[#d0d7df] dark:border-[#eee] hover:bg-[#0f59d1] dark:hover:bg-[#eee] bg-[#f8f9fd] dark:bg-transparent hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150 cursor-pointer py-0.5 px-3">
                <button onClick={() => setSelectedAsset(asset.symbol)}>
                  Details
                </button>
              </a>
            </div>
          </div>
        ))}
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
