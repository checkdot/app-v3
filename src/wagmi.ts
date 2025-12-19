import {
  cookieStorage,
  createConfig,
  createStorage,
  fallback,
  http,
  unstable_connector,
} from "wagmi"
import { bsc, mainnet } from "wagmi/chains"
import { baseAccount, injected, walletConnect } from "wagmi/connectors"

export function getConfig() {
  return createConfig({
    chains: [bsc, mainnet],
    connectors: [
      injected(),
      baseAccount(),
      walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: fallback([
        unstable_connector(injected),
        http("https://ethereum-rpc.publicnode.com"),
      ]),
      [bsc.id]: fallback([
        unstable_connector(injected),
        http("https://bsc-rpc.publicnode.com"),
      ]),
    },
    batch: {
      [mainnet.id]: { multicall: { batchSize: 100 } },
      [bsc.id]: { multicall: { batchSize: 100 } },
    },
  })
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
