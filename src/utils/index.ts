import { SUPPORTED_CHAINS } from "@/constants"
import { zeroAddress } from "viem"

export function formatNumberUnit(num: number, decimals: number = 2): string {
  const units = [
    { value: 1_000_000_000_000, symbol: "T" },
    { value: 1_000_000_000, symbol: "B" },
    { value: 1_000_000, symbol: "M" },
    { value: 1_000, symbol: "K" },
  ]

  for (const unit of units) {
    if (num >= unit.value) {
      const formatted = (num / unit.value)
        .toFixed(decimals)
        .replace(/\.0+$/, "")
        .replace(/(\.[0-9]*?)0+$/, "$1")

      return formatted + unit.symbol
    }
  }

  // Handle small numbers (less than 0.01)
  if (num < 0.01 && num > 0) {
    const str = num.toString()
    const match = str.match(/^0\.0*[1-9]/)
    if (match) {
      return match[0]
    }
  }

  return num
    .toFixed(decimals)
    .replace(/\.0+$/, "")
    .replace(/(\.[0-9]*?)0+$/, "$1")
}

export function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

export function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}

export function getTokenImage(chainId: number, token: `0x${string}`): string {
  if (token === zeroAddress) {
    return `https://cdn.sushi.com/image/upload/f_auto,c_limit,w_200/native-currency/${SUPPORTED_CHAINS.find((chain) => chain.id === chainId)?.logo}.svg`
  }
  return `https://cdn.sushi.com/image/upload/f_auto,c_limit,w_200/tokens/${chainId}/${token}.jpg`
}
