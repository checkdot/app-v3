import { injected, walletConnect } from "wagmi/connectors"

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
    connector: injected(),
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
    nativeCurrency: "ETH",
    logo: "ethereum",
    icon: "/assets/ETH.png",
    explorer: "https://etherscan.io",
    cdt: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
    lending: "0x24Ac62148a38eb4bEa9570629f80FfdcF08a059e",
    precision: 6,
  },
  {
    id: 56,
    name: "Binance Smart Chain",
    nativeCurrency: "BNB",
    logo: "bnb",
    icon: "/assets/BSC.png",
    explorer: "https://bscscan.com",
    cdt: "0x0cBD6fAdcF8096cC9A43d90B45F65826102e3eCE",
    lending: "0x52E8808F85D1c470d36eb5BE7bb0b5b30be49E4A",
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

export const SUPPORTED_PAIR_TOKENS = {
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  56: {
    USDC: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    USDT: "0x55d398326f99059ff775485246999027b3197955",
    WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  },
}

export const BASE_INTEREST_RATE = 2
export const SLOPE_INTEREST_RATE = 10

export const FAQ_DATA = [
  {
    category: "General",
    items: [
      {
        q: "What is CheckDot Lending?",
        a: "CheckDot Lending is a decentralized lending protocol that allows you to deposit supported assets as collateral and borrow other assets against them. You can deposit assets like USDT, BNB, USDC, WETH, or CDT, and borrow up to 80% of your collateral value based on each asset's borrowing weight.",
      },
      {
        q: "Which assets can I deposit?",
        a: "You can deposit the following assets: USDT, BNB, USDC, WETH, and CDT. Each asset has a different collateral weight that determines how much you can borrow against it.",
      },
      {
        q: "What are collateral weights and how do they work?",
        a: "Collateral weights determine how much borrowing power each asset provides. USDT and USDC have a 1.0 weight (100%), meaning $1000 deposited gives you $1000 in borrowing capacity. BNB and WETH have a 0.7 weight (70%), so $1000 deposited gives you $700 in borrowing capacity. CDT has a 0.5 weight (50%), meaning $1000 deposited gives you $500 in borrowing capacity.",
      },
      {
        q: "What networks is this available on?",
        a: "Currently, CheckDot Lending is available on Binance Smart Chain (BSC) and Ethereum mainnet. The protocol may expand to additional networks in the future.",
      },
      {
        q: "How are asset prices determined?",
        a: "Asset prices are determined using on-chain price oracles from DEX liquidity pools. USDT and USDC are pegged at $1. BNB and WETH prices come from their respective USDT pairs. CDT price is calculated using its WBNB pair and the WBNB price. All prices are updated in real-time from on-chain sources.",
      },
    ],
  },
  {
    category: "Depositing / Withdrawing",
    items: [
      {
        q: "Can I withdraw my collateral at any time?",
        a: "Yes, you can withdraw your collateral at any time, as long as the withdrawal doesn't make your position unhealthy. The protocol will prevent you from withdrawing if it would cause your indebtedness to exceed the safe threshold or if you don't have enough remaining collateral to cover your debt.",
      },
      {
        q: "Can I add more collateral to an existing position?",
        a: "Yes, you can deposit additional collateral at any time. This will increase your borrowing capacity and improve your position's health, potentially reducing your indebtedness ratio.",
      },
    ],
  },
  {
    category: "Borrowing / Repaying",
    items: [
      {
        q: "How much can I borrow?",
        a: "You can borrow up to 80% of your total borrowing capacity. For example, if you deposit $1000 USDT (1.0 weight), you have $1000 in borrowing capacity and can borrow up to $800 worth of any supported asset. The 80% limit helps protect against liquidation.",
      },
      {
        q: "Can I borrow different assets than what I deposited?",
        a: "Yes! You can deposit any supported asset and borrow any other supported asset. For example, you can deposit USDT and borrow BNB, or deposit CDT and borrow USDC. The borrowing limit is based on the USD value of your collateral.",
      },
      {
        q: "How do I repay my loan?",
        a: "You can repay your loan at any time by calling the repay function with the asset you borrowed and the amount you want to repay. You can repay partially or in full. Interest accrues continuously, so the amount you need to repay will be slightly more than what you borrowed due to accrued interest.",
      },
    ],
  },
  {
    category: "Interest Rates",
    items: [
      {
        q: "How do interest rates work?",
        a: "Interest rates are dynamic and based on pool utilization. The base rate is 2% annually, with an additional slope of up to 10% based on how much of the pool is being borrowed. Higher utilization means higher interest rates. Interest accrues continuously and compounds over time.",
      },
      {
        q: "Are there any fees?",
        a: "The protocol charges interest on borrowed amounts, which varies based on pool utilization. There are no upfront fees for depositing, borrowing, or repaying. Liquidators receive a 5% bonus when liquidating positions, which is paid from the liquidated collateral.",
      },
    ],
  },
  {
    category: "Liquidation",
    items: [
      {
        q: "What is liquidation and when does it happen?",
        a: "Liquidation occurs when your indebtedness (debt-to-collateral ratio) exceeds 85%. At this point, anyone can liquidate your position by repaying your debt in exchange for your collateral plus a 5% liquidation bonus. This protects the protocol and ensures loans remain properly collateralized.",
      },
      {
        q: "How can I avoid liquidation?",
        a: "To avoid liquidation, keep your indebtedness below 85%. You can do this by: 1) Repaying some of your debt, 2) Adding more collateral, 3) Monitoring your position regularly, especially during market volatility. The protocol prevents you from borrowing more than 80% to provide a safety buffer.",
      },
      {
        q: "What happens if I get liquidated?",
        a: "If your position is liquidated, a liquidator repays your debt and receives your collateral plus a 5% bonus. The liquidation helps restore your position's health, but you'll lose the collateral that was liquidated. It's important to monitor your position to avoid this.",
      },
    ],
  },
  {
    category: "Security",
    items: [
      {
        q: "Is my collateral safe?",
        a: "The protocol uses battle-tested security practices including reentrancy guards, access controls, and proper collateralization requirements. However, as with any DeFi protocol, there are risks including smart contract risks, market volatility, and liquidation risks. Always do your own research and only deposit what you can afford to lose.",
      },
    ],
  },
]
