"use client"

import RingProgressBar from "@/components/RingProgressBar"
import ExternalLink from "@/components/svgs/ExternalLink"
import {
  BASE_INTEREST_RATE,
  SLOPE_INTEREST_RATE,
  SUPPORTED_CHAINS,
} from "@/constants"
import useTotalLendingInfo from "@/hooks/useTotalLendingInfo"
import usePrices from "@/hooks/usePrices"
import { formatNumberUnit, getTokenImage } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import { formatUnits } from "viem"
import { useChainId } from "wagmi"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { useEffect, useState, useMemo, useRef } from "react"
import { useQuery } from "@tanstack/react-query"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function AssetDetailsPage({ params }: { params: { asset: string } }) {
  const { asset: token } = params
  const chainId = useChainId()
  const prices = usePrices()
  const {
    reserves,
    utilizations,
    deposits,
    borrowRates,
    borrows,
    decimals,
    supportedTokens,
    symbols,
  } = useTotalLendingInfo()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)
  const tokenDecimals = decimals?.[token.toLowerCase() as `0x${string}`] ?? 18
  const pricePrecision = 18 - (tokenDecimals - (chain?.precision ?? 18))
  const price = prices?.[token.toLowerCase() as `0x${string}`] ?? 0n
  const reserve = reserves?.[token.toLowerCase() as `0x${string}`] ?? 0n
  const utilization = utilizations?.[token.toLowerCase() as `0x${string}`] ?? 0n

  const totalDepositUSD = supportedTokens?.reduce(
    (acc, item) =>
      acc +
      Number(
        formatUnits(
          deposits?.[item.toLowerCase() as `0x${string}`] ?? 0n,
          decimals?.[item.toLowerCase() as `0x${string}`] ?? 18
        )
      ) *
        Number(
          formatUnits(
            prices?.[item.toLowerCase() as `0x${string}`] ?? 0n,
            18 -
              ((decimals?.[item.toLowerCase() as `0x${string}`] ?? 18) -
                (chain?.precision ?? 18))
          )
        ),
    0
  )
  // const totalBorrowUSD = SUPPORTED_ASSETS.reduce(
  //   (acc, item) =>
  //     acc +
  //     Number(
  //       formatUnits(
  //         borrows?.[item.symbol] ?? 0n,
  //         item.decimals?.[chainId] ?? 18
  //       )
  //     ) *
  //       Number(
  //         formatUnits(
  //           price,
  //           18 - ((item.decimals?.[chainId] ?? 18) - (chain?.precision ?? 18))
  //         )
  //       ),
  //   0
  // )

  const assetDepositUSD =
    Number(
      formatUnits(
        deposits?.[token.toLowerCase() as `0x${string}`] ?? 0n,
        tokenDecimals
      )
    ) * Number(formatUnits(price, pricePrecision))

  const assetBorrowUSD =
    Number(
      formatUnits(
        borrows?.[token.toLowerCase() as `0x${string}`] ?? 0n,
        tokenDecimals
      )
    ) * Number(formatUnits(price, pricePrecision))

  const interestRates = Array.from({ length: 101 }, (_, i) => {
    return {
      utilization: i,
      borrowRate: BASE_INTEREST_RATE + (SLOPE_INTEREST_RATE * i) / 100,
    }
  })

  useEffect(() => {
    setMounted(true)
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const currentUtilization = Number(formatUnits(utilization, 18)) * 100

  // Store utilization in a ref so the plugin can access the latest value
  const utilizationRef = useRef(currentUtilization)

  // Update the ref when utilization changes using useQuery
  useQuery({
    queryKey: ["utilization", token, currentUtilization],
    queryFn: () => {
      utilizationRef.current = currentUtilization
      return currentUtilization
    },
  })

  const chartData = {
    labels: interestRates.map((item) => item.utilization),
    datasets: [
      {
        label: "Borrow Rate (%)",
        data: interestRates.map((item) => item.borrowRate),
        borderColor: "#33f693",
        backgroundColor: "rgba(51, 246, 147, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  }

  const verticalLinePlugin = useMemo(
    () => ({
      id: "verticalLine",
      afterDraw: (chart: any) => {
        const ctx = chart.ctx
        const xAxis = chart.scales.x
        const yAxis = chart.scales.y

        // Get the current utilization from the ref (always latest value)
        const currentUtil = utilizationRef.current
        const utilizationIndex = Math.round(currentUtil)

        if (utilizationIndex < 0 || utilizationIndex > 100) return
        if (isNaN(utilizationIndex)) return

        // For linear scale, use the utilization value directly
        const xPosition = xAxis.getPixelForValue(utilizationIndex)

        // Draw the vertical dashed line
        ctx.save()
        ctx.strokeStyle = isDark
          ? "rgba(255, 255, 255, 0.5)"
          : "rgba(0, 0, 0, 0.5)"
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(xPosition, yAxis.top)
        ctx.lineTo(xPosition, yAxis.bottom)
        ctx.stroke()
        ctx.restore()
      },
    }),
    [isDark]
  )

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: isDark ? "#fff" : "#000",
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#18171c" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: isDark ? "#d2d2d212" : "#afafaf7a",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            return `Borrow Rate: ${context.parsed.y.toFixed(2)}%`
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear" as const,
        min: 0,
        max: 100,
        grid: {
          color: isDark
            ? "rgba(210, 210, 210, 0.07)"
            : "rgba(175, 175, 175, 0.2)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
          font: {
            size: 11,
            weight: 600,
          },
          maxRotation: 0,
          stepSize: 10,
          callback: function (value: any) {
            return `${value}%`
          },
        },
        title: {
          display: true,
          text: "Utilization Rate (%)",
          color: isDark ? "#fff" : "#000",
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
      y: {
        grid: {
          color: isDark
            ? "rgba(210, 210, 210, 0.07)"
            : "rgba(175, 175, 175, 0.2)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
          font: {
            size: 11,
            weight: 600,
          },
          callback: function (value: any) {
            return `${value}%`
          },
        },
        title: {
          display: true,
          text: "Interest Rate (%)",
          color: isDark ? "#fff" : "#000",
          font: {
            size: 12,
            weight: 600,
          },
        },
      },
    },
  }

  return (
    <div className="mt-20">
      <div className="flex items-center flex-wrap px-4">
        <div className="flex items-center p-4 mr-10">
          <Image
            src={getTokenImage(chainId, token as `0x${string}`)}
            alt={token}
            width={100}
            height={100}
            className="rounded-full size-16 mr-3"
          />
          <div>
            <h2 className="text-4xl font-bold">
              {symbols?.[token.toLowerCase() as `0x${string}`] ?? ""}
            </h2>
            <div className="flex items-center mt-1">
              <Image
                src={chain?.icon ?? ""}
                alt={chain?.name ?? ""}
                width={100}
                height={100}
                className="rounded-full size-4 mr-2"
              />
              <Link
                href={`${chain?.explorer}/address/${token}`}
                target="_blank"
                className="flex items-center opacity-50 hover:opacity-60 transition-all duration-150"
              >
                <ExternalLink className="size-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center space-x-10">
          <div className="flex p-4 flex-col">
            <span className="opacity-50">Price</span>
            <span className="text-2xl">
              $
              {Number(formatUnits(price, pricePrecision)).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          </div>
          <div className="flex p-4 flex-col">
            <span className="opacity-50">Reserve</span>
            <span className="text-2xl">
              {formatNumberUnit(Number(formatUnits(reserve, tokenDecimals)))}{" "}
              {symbols?.[token.toLowerCase() as `0x${string}`] ?? ""}
            </span>
          </div>
          <div className="flex p-4 flex-col">
            <span className="opacity-50">Utilization Rate</span>
            <span className="text-2xl">
              {(Number(formatUnits(utilization, 18)) * 100).toFixed(2)} %
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#080811] mt-10 mx-4">
        <div className="flex flex-wrap border-b border-b-[#afafaf7a] dark:border-b-[#d2d2d212] p-6">
          <h2 className="text-lg font-bold mr-10 w-[200px] min-w-[200px] mb-4">
            Deposit Info
          </h2>
          <div className="flex flex-wrap items-center justify-between space-x-10 -mt-4">
            <RingProgressBar
              progress={(assetDepositUSD / (totalDepositUSD ?? 0)) * 100 || 0}
              showPercentage
              size={100}
              className="py-4"
            />
            <div className="flex items-center flex-wrap space-x-10">
              <div className="flex flex-col py-4">
                <span className="opacity-50 text-sm">Total Deposited</span>
                <span className="text-xl mt-1">
                  ${formatNumberUnit(assetDepositUSD ?? 0)} of $
                  {formatNumberUnit(totalDepositUSD ?? 0)}
                </span>
              </div>
              <div className="flex flex-col py-4">
                <span className="opacity-50 text-sm">APR</span>
                <span className="text-xl mt-1">
                  {(
                    Number(
                      formatUnits(
                        ((borrowRates?.[token.toLowerCase() as `0x${string}`] ??
                          0n) *
                          utilization) /
                          BigInt(1e18),
                        18
                      )
                    ) * 100
                  ).toFixed(2)}{" "}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap border-b border-b-[#afafaf7a] dark:border-b-[#d2d2d212] p-6">
          <h2 className="text-lg font-bold mr-10 w-[200px] min-w-[200px] mb-4">
            Borrow Info
          </h2>
          <div className="flex flex-wrap items-center justify-between space-x-10 -mt-4">
            <RingProgressBar
              progress={(assetBorrowUSD / (totalDepositUSD ?? 0)) * 100 || 0}
              showPercentage
              size={100}
              className="py-4"
            />
            <div className="flex items-center flex-wrap space-x-10">
              <div className="flex flex-col py-4">
                <span className="opacity-50 text-sm">Total Borrowed</span>
                <span className="text-xl mt-1">
                  ${formatNumberUnit(assetBorrowUSD)} of $
                  {formatNumberUnit(totalDepositUSD ?? 0)}
                </span>
              </div>
              <div className="flex flex-col py-4">
                <span className="opacity-50 text-sm">APR</span>
                <span className="text-xl mt-1">
                  {(
                    Number(
                      formatUnits(
                        borrowRates?.[token.toLowerCase() as `0x${string}`] ??
                          0n,
                        18
                      )
                    ) * 100
                  ).toFixed(2)}{" "}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap p-6">
          <h2 className="text-lg font-bold mr-10 w-[200px] min-w-[200px] mb-4">
            Interest Rate Model
          </h2>
          <div className="flex-1 min-w-[300px]">
            <div className="mb-6">
              <div className="flex flex-col py-4">
                <span className="opacity-50 text-sm">
                  Current Utilization Rate
                </span>
                <span className="text-xl mt-1">
                  {(Number(formatUnits(utilization, 18)) * 100).toFixed(2)} %
                </span>
              </div>
            </div>
            <div className="h-[400px] w-full">
              {mounted && (
                <Line
                  data={chartData}
                  options={chartOptions}
                  plugins={[verticalLinePlugin]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetDetailsPage
