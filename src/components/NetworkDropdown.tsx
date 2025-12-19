"use client"

import { SUPPORTED_CHAINS } from "@/constants"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import Image from "next/image"
import ChevronDown from "./svgs/ChevronDown"

interface NetworkDropdownProps {
  selectedNetwork: number
  onChange: (network: number) => void
  className?: string
}

const NetworkDropdown = ({
  selectedNetwork,
  onChange,
}: NetworkDropdownProps) => {
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === selectedNetwork)

  return (
    <Menu>
      <MenuButton className="w-full flex items-center justify-between px-2 py-2 border border-[#d0d7df] dark:border-[#1f3a55] cursor-pointer outline-none rounded-xl">
        <div className="flex items-center gap-2">
          <Image
            src={chain?.icon ?? ""}
            alt={chain?.name ?? ""}
            width={24}
            height={24}
          />
          {chain?.name}
        </div>
        <ChevronDown className="size-4" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-(--button-width) origin-top-right rounded-xl border border-[#d0d7df] dark:border-[#1f3a55] bg-white dark:bg-[#080811] transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        {SUPPORTED_CHAINS.map((chain) => (
          <MenuItem key={chain.id}>
            <button
              className="flex w-full items-center gap-2 rounded-lg p-2 data-focus:bg-white/5 cursor-pointer"
              onClick={() => onChange(chain.id)}
            >
              <Image src={chain.icon} alt={chain.name} width={24} height={24} />
              {chain.name}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default NetworkDropdown
