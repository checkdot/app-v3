export function formatNumberUnit(num: number): string {
  const units = [
    { value: 1_000_000_000_000, symbol: "T" },
    { value: 1_000_000_000, symbol: "B" },
    { value: 1_000_000, symbol: "M" },
    { value: 1_000, symbol: "K" },
  ]

  for (const unit of units) {
    if (num >= unit.value) {
      const formatted = (num / unit.value)
        .toFixed(2)
        .replace(/\.0+$/, "")
        .replace(/(\.[0-9]*?)0+$/, "$1")

      return formatted + unit.symbol
    }
  }

  return num
    .toFixed(2)
    .replace(/\.0+$/, "")
    .replace(/(\.[0-9]*?)0+$/, "$1")
}

export function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

export function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}
