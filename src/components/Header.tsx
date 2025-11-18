import Image from "next/image"
import Link from "next/link"
import ConnectButton from "./ConnectButton"
import ThemeSwitchButton from "./ThemeSwitchButton"

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 bg-white dark:bg-[#18171c] border-b border-b-[#afafaf7a] dark:border-b-[#d2d2d212] flex items-center justify-between h-14 py-1 px-4">
      <Link href={"/"}>
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
      <div className="flex items-center space-x-2">
        <ConnectButton />
        <ThemeSwitchButton />
      </div>
    </header>
  )
}

export default Header
