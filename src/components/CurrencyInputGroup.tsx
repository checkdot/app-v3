"use client"

import { useQuery } from "@tanstack/react-query"
import React, { useRef } from "react"

interface CurrencyInputGroupProps {
  value: string
  symbol: string
  price: number
  setValue: (e: string) => void
  className?: string
  onMax?: () => void
}

const CurrencyInputGroup: React.FC<CurrencyInputGroupProps> = ({
  value,
  symbol,
  setValue,
  price,
  className,
  onMax,
}) => {
  const symbolRef = useRef<HTMLDivElement>(null)

  const { data: paddingRight } = useQuery({
    queryKey: ["input-padding", symbol],
    queryFn: () => {
      if (symbolRef.current) {
        return symbolRef.current.offsetWidth + 20
      }
      return 80
    },
  })

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
        {onMax && (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-lg text-sm h-9 px-3 py-2 bg-transparent text-[#0f59d1] dark:text-[#eee] hover:bg-[#0f59d1] dark:hover:bg-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] border border-[#d0d7df] dark:border-[#eee] cursor-pointer"
            onClick={onMax}
          >
            MAX
          </button>
        )}
      </div>
      <input
        type="number"
        className="flex w-full rounded-xl border transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 relative z-0 border-[#d0d7df] dark:border-[#1f3a55] bg-transparent pt-2 pb-8 text-right text-2xl text-black dark:text-white h-20"
        style={{ paddingLeft: "84px", paddingRight: `${paddingRight || 80}px` }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        step="any"
      />
      <div
        ref={symbolRef}
        className="absolute right-4 top-0 z-10 flex flex-col items-end justify-center h-20"
      >
        <p className="text-right text-2xl text-black dark:text-white font-semibold">
          {symbol}
        </p>
        <p className="text-sm text-right text-black dark:text-white font-normal mt-1">
          $
          {(price * (Number(value) || 0)).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  )
}

export default CurrencyInputGroup
