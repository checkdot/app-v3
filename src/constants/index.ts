import { metaMask, walletConnect } from "wagmi/connectors"

export const SUPPORTED_ASSETS = [
  {
    image: "/assets/cdt.png",
    symbol: "CDT",
    weight: 0.5,
    addresses: {
      1: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
      56: "0x0cBD6fAdcF8096cC9A43d90B45F65826102e3eCE",
    },
  },
  {
    image: "/assets/bnb.png",
    symbol: "BNB",
    weight: 0.7,
    addresses: {
      1: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
      56: "0x0000000000000000000000000000000000000000",
    },
  },
  {
    image: "/assets/weth.png",
    symbol: "ETH",
    weight: 0.7,
    addresses: {
      1: "0x0000000000000000000000000000000000000000",
      56: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    },
  },
  {
    image: "/assets/usdc.png",
    symbol: "USDC",
    weight: 1,
    decimals: {
      1: 6,
      56: 18,
    },
    addresses: {
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      56: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    },
  },
  {
    image: "/assets/usdt.png",
    symbol: "USDT",
    weight: 1,
    decimals: {
      1: 6,
      56: 18,
    },
    addresses: {
      1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      56: "0x55d398326f99059ff775485246999027b3197955",
    },
  },
]

export const SUPPORTED_CONNECTORS = [
  {
    name: "MetaMask",
    icon: "/assets/metamask.svg",
    connector: metaMask(),
  },
  {
    name: "WalletConnect",
    icon: "/assets/wallet-connect.png",
    connector: walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
  },
]

export const SUPPORTED_CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    icon: "/assets/ETH.png",
    cdt: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
    lending: "0x24Ac62148a38eb4bEa9570629f80FfdcF08a059e",
    precision: 6,
  },
  {
    id: 56,
    name: "Binance Smart Chain",
    icon: "/assets/BSC.png",
    cdt: "0x0cBD6fAdcF8096cC9A43d90B45F65826102e3eCE",
    lending: "0x0C39c8d851D8C5a0B25f319d42523dbf33A5df36",
    precision: 18,
  },
  // {
  //   id: 43114,
  //   name: "Avalanche",
  //   icon: "/assets/AVAX.png",
  // },
  // {
  //   id: 250,
  //   name: "Fantom",
  //   icon: "/assets/FTM.png",
  // },
  // {
  //   id: 137,
  //   name: "Polygon",
  //   icon: "/assets/MATIC.png",
  // },
  // {
  //   id: 42161,
  //   name: "Arbitrum",
  //   icon: "/assets/ARB.png",
  // },
  // {
  //   id: 614,
  //   name: "Graphlinq",
  //   icon: "/assets/GLQ.png",
  // },
  // {
  //   id: 8453,
  //   name: "Base",
  //   icon: "/assets/BASE.png",
  // },
]
