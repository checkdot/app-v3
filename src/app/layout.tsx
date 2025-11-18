import "./globals.css"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { type ReactNode } from "react"
import { cookieToInitialState } from "wagmi"

import { getConfig } from "../wagmi"
import { Providers } from "./providers"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "CheckDot - Lending",
  description: "CheckDot - Lending",
}

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  )
  return (
    <html lang="en">
      <body>
        <Providers initialState={initialState}>
          <Header />
          {props.children}
        </Providers>
      </body>
    </html>
  )
}
