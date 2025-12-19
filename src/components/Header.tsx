"use client"

import Image from "next/image"
import Link from "next/link"
import ConnectButton from "./ConnectButton"
import ThemeSwitchButton from "./ThemeSwitchButton"
import { usePathname } from "next/navigation"
import Pool from "./svgs/Pool"
import Reward from "./svgs/Reward"
import Question from "./svgs/Question"

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="absolute top-0 left-0 right-0 bg-white dark:bg-[#18171c] border-b border-b-[#afafaf7a] dark:border-b-[#d2d2d212] flex items-center justify-between h-14 py-1 px-4">
      <div className="flex items-center">
        <Link href={"/"} className="md:mr-8">
          <Image
            src={"/assets/logo-white.svg"}
            alt="CheckDot"
            width={100}
            height={100}
            className="not-dark:hidden"
          />
          <Image
            src={"/assets/logo-black.svg"}
            alt="CheckDot"
            width={100}
            height={100}
            className="dark:hidden"
          />
        </Link>
        <div className="flex items-center md:space-x-6 max-md:fixed max-md:bottom-0 max-md:right-0 max-md:h-14 max-md:w-screen max-md:z-100 max-md:bg-white max-md:dark:bg-[#18171c] max-md:border-t max-md:border-t-[#1f3a55]">
          <Link
            href={"/"}
            data-active={pathname === "/"}
            className="max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:text-[10px] max-md:w-[21.2766%] text-[#6b7c93] md:font-bold p-2 md:rounded-2xl hover:bg-[#eee]/40 dark:data-[active=true]:text-[#33f693] sm:max-md:data-[active=true]:bg-[#00000029] dark:sm:max-md:data-[active=true]:bg-[#10101a] dark:sm:max-md:data-[active=true]:brightness-[2.5]"
          >
            <Pool className="md:hidden size-6 max-md:mb-0.5" />
            <span className="dark:sm:max-md:text-white max-sm:text-[#6b7c93]">
              Pools
            </span>
          </Link>
          <Link
            href={"/rewards"}
            data-active={pathname === "/rewards"}
            className="max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:text-[10px] max-md:w-[21.2766%] text-[#6b7c93] md:font-bold p-2 md:rounded-2xl hover:bg-[#eee]/40 dark:data-[active=true]:text-[#33f693] sm:max-md:data-[active=true]:bg-[#00000029] dark:sm:max-md:data-[active=true]:bg-[#10101a] dark:sm:max-md:data-[active=true]:brightness-[2.5]"
          >
            <Reward className="md:hidden size-6 max-md:mb-0.5" />
            <span className="dark:sm:max-md:text-white max-sm:text-[#6b7c93]">
              Rewards
            </span>
          </Link>
          <Link
            href={"/faq"}
            data-active={pathname === "/faq"}
            className="max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:text-[10px] max-md:w-[21.2766%] text-[#6b7c93] md:font-bold p-2 md:rounded-2xl hover:bg-[#eee]/40 dark:data-[active=true]:text-[#33f693] sm:max-md:data-[active=true]:bg-[#00000029] dark:sm:max-md:data-[active=true]:bg-[#10101a] dark:sm:max-md:data-[active=true]:brightness-[2.5]"
          >
            <Question className="md:hidden size-6 max-md:mb-0.5" />
            <span className="dark:sm:max-md:text-white max-sm:text-[#6b7c93]">
              FAQ
            </span>
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <ConnectButton />
        <ThemeSwitchButton />
      </div>
    </header>
  )
}

export default Header
