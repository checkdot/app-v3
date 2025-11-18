"use client"

import { useState } from "react"
import WalletConnectModal from "./WalletConnectModal"
import { useAccount, useBalance, useDisconnect } from "wagmi"
import Wallet from "./svgs/Wallet"
import ChainSwitchModal from "./ChainSwitchModal"
import { SUPPORTED_CHAINS } from "@/constants"
import Image from "next/image"

const ConnectButton = () => {
  const { disconnectAsync } = useDisconnect()
  const [walletConnectModalOpen, setWalletConnectModalOpen] = useState(false)
  const [chainSwitchModalOpen, setChainSwitchModalOpen] = useState(false)
  const { address, chainId } = useAccount()

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

  const { data: balance } = useBalance({
    address: address,
    chainId: chainId as any,
    token: chain?.cdt as any,
    query: {
      enabled: !!address && !!chainId,
    },
  })

  return (
    <>
      {address ? (
        <>
          <button className="flex items-center font-bold bg-transparent text-[#0f59d1] dark:text-[#eee] py-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-[#0f59d1] dark:hover:bg-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150 max-sm:hidden">
            <Image
              src={"/assets/cdt.png"}
              alt="CDT"
              width={24}
              height={24}
              className="size-[18px] mr-2 scale-125"
            />
            <span className="whitespace-nowrap">
              {Number(balance?.formatted ?? 0).toFixed(0)} CDT
            </span>
          </button>
          <button
            className="flex items-center font-bold bg-transparent text-[#0f59d1] dark:text-[#eee] py-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-[#0f59d1] dark:hover:bg-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150"
            onClick={() => setChainSwitchModalOpen(true)}
          >
            <Image
              src={chain?.icon ?? ""}
              alt={chain?.name ?? ""}
              width={24}
              height={24}
              className="size-[18px]"
            />
            <span className="max-sm:hidden ml-2">{chain?.name}</span>
          </button>
          <button
            className="flex items-center font-bold bg-transparent text-[#0f59d1] dark:text-[#eee] py-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-[#0f59d1] dark:hover:bg-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150"
            onClick={() => disconnectAsync()}
          >
            <Wallet className="text-[#33f693] size-5" />
            <span className="ml-2 max-sm:hidden">
              {address.slice(0, 2)}...{address.slice(-4)}
            </span>
          </button>
        </>
      ) : (
        <button
          className="flex items-center font-bold bg-transparent text-[#0f59d1] dark:text-[#eee] py-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-[#0f59d1] dark:hover:bg-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150"
          onClick={() => setWalletConnectModalOpen(true)}
        >
          <span className="mr-2 max-sm:hidden">Connect Wallet</span>
          <svg
            _ngcontent-serverApp-c95=""
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="arrow-circle-right"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="size-3.5"
          >
            <path
              _ngcontent-serverApp-c95=""
              fill="currentColor"
              d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm-28.9 143.6l75.5 72.4H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h182.6l-75.5 72.4c-9.7 9.3-9.9 24.8-.4 34.3l11 10.9c9.4 9.4 24.6 9.4 33.9 0L404.3 273c9.4-9.4 9.4-24.6 0-33.9L271.6 106.3c-9.4-9.4-24.6-9.4-33.9 0l-11 10.9c-9.5 9.6-9.3 25.1.4 34.4z"
            ></path>
          </svg>
        </button>
      )}
      <WalletConnectModal
        open={walletConnectModalOpen}
        onClose={() => setWalletConnectModalOpen(false)}
      />
      <ChainSwitchModal
        open={chainSwitchModalOpen}
        onClose={() => setChainSwitchModalOpen(false)}
      />
    </>
  )
}

export default ConnectButton
