"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import Cancel from "./svgs/Cancel"
import Image from "next/image"
import Wallet from "./svgs/Wallet"
import { SUPPORTED_CONNECTORS } from "@/constants"
import { Connector, useConnect } from "wagmi"

interface WalletConnectModalProps {
  open: boolean
  onClose: () => void
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  open,
  onClose,
}) => {
  const { connectAsync } = useConnect()

  const onConnect = (connector: Connector) => {
    connectAsync({ connector })
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
              Select a Wallet
            </h2>
            {SUPPORTED_CONNECTORS.map((connector) => (
              <div
                key={connector.name}
                className="flex items-center justify-between rounded-md hover:brightness-150 bg-[#e8e8e8] dark:bg-black p-2.5 cursor-pointer mt-4"
                onClick={() =>
                  onConnect(connector.connector as unknown as Connector)
                }
              >
                <div className="flex items-center">
                  <Image
                    src={connector.icon}
                    alt={connector.name}
                    width={24}
                    height={24}
                    className="size-[30px]"
                  />
                  <span className="font-bold text-[#2f2f2f] dark:text-[#e5e7f5d1] ml-1">
                    {connector.name}
                  </span>
                </div>
                <Wallet className="size-[30px] text-[#6b7c93]" />
              </div>
            ))}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default WalletConnectModal
