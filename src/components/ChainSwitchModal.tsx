"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import Cancel from "./svgs/Cancel"
import Image from "next/image"
import { SUPPORTED_CHAINS } from "@/constants"
import { useChainId, useSwitchChain } from "wagmi"

interface ChainSwitchModalProps {
  open: boolean
  onClose: () => void
}

const ChainSwitchModal: React.FC<ChainSwitchModalProps> = ({
  open,
  onClose,
}) => {
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()

  const onChangeNetwork = (id: number) => {
    switchChainAsync({ chainId: id as any })
    onClose()
  }

  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-end">
          <DialogPanel
            transition
            className="flex flex-col w-[600px] max-w-full h-screen rounded-ss-md rounded-es-md bg-white dark:bg-[#141421] data-closed:transform-[scale(95%)] data-closed:opacity-0 p-6"
          >
            <a
              className="fixed top-6 right-[30px] cursor-pointer opacity-50 hover:opacity-100"
              onClick={onClose}
            >
              <Cancel className="size-6" />
            </a>
            <h2 className="text-xl font-bold mb-3 dark:text-[#e5e7f5d1]">
              Select Blockchain Network
            </h2>
            {SUPPORTED_CHAINS.map((chain) => (
              <div
                key={chain.id}
                data-active={chainId === chain.id}
                className="flex items-center justify-between rounded-lg text-[#0f59d1] dark:text-[#eee] bg-[#f8f9fd] dark:bg-[#10101a] hover:bg-[#0f59d1] dark:hover:bg-[#eee] hover:text-[#eee] dark:hover:text-[#10101a] border border-[#d0d7df] dark:border-transparent not-dark:hover:border-[#0f59d1] py-2 px-3 cursor-pointer mt-4 data-[active=true]:opacity-65 transition-all duration-150"
                onClick={() => onChangeNetwork(chain.id)}
              >
                <span className="text-sm font-semibold">{chain.name}</span>
                <Image
                  src={chain.icon}
                  alt={chain.name}
                  width={24}
                  height={24}
                  className="size-5"
                />
              </div>
            ))}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default ChainSwitchModal
