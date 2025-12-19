"use client"

import { useState } from "react"
import NetworkDropdown from "./NetworkDropdown"
import InputGroup from "./InputGroup"
import { useQuery } from "@tanstack/react-query"
import { usePublicClient, useWalletClient } from "wagmi"
import { erc20Abi, isAddress } from "viem"
import CheckBoxGroup from "./CheckBoxGroup"
import toast from "react-hot-toast"
import pairAbi from "@/abi/pairAbi"
import { SUPPORTED_CHAINS, SUPPORTED_PAIR_TOKENS } from "@/constants"
import lendingAbi from "@/abi/lendingAbi"

const AddAssetForm = () => {
  const [chainId, setChainId] = useState(1)
  const [tokenAddress, setTokenAddress] = useState("")
  const [pairAddress, setPairAddress] = useState("")
  const [isV2, setIsV2] = useState(false)
  const publicClient = usePublicClient({ chainId: chainId as any })
  const { data: walletClient } = useWalletClient({ chainId })
  const [assetWeight, setAssetWeight] = useState("100")

  const { data: tokenInfo } = useQuery({
    queryKey: ["token-info", tokenAddress, chainId],
    queryFn: async () => {
      const results = await publicClient.multicall({
        contracts: [
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "name",
          },
          {
            address: tokenAddress as `0x${string}`,
            abi: erc20Abi,
            functionName: "symbol",
          },
        ],
      })
      return {
        name: results[0]?.result,
        symbol: results[1]?.result,
      }
    },
  })

  const { data: pairInfo } = useQuery({
    queryKey: ["pair-info", pairAddress, chainId],
    queryFn: async () => {
      const results = await publicClient.multicall({
        contracts: [
          {
            address: pairAddress as `0x${string}`,
            abi: pairAbi,
            functionName: "token0",
          },
          {
            address: pairAddress as `0x${string}`,
            abi: pairAbi,
            functionName: "token1",
          },
        ],
      })
      return {
        token0: results[0]?.result,
        token1: results[1]?.result,
      }
    },
  })

  const onAddAsset = async () => {
    if (!tokenAddress || !pairAddress || !chainId || !publicClient) return
    if (!isAddress(tokenAddress)) return toast.error("Invalid token address")
    if (!isAddress(pairAddress)) return toast.error("Invalid pair address")
    if (!tokenInfo?.name || !tokenInfo?.symbol)
      return toast.error("Invalid token address")
    if (!pairInfo?.token0 || !pairInfo?.token1)
      return toast.error("Invalid pair address1")

    const pairToken =
      pairInfo.token0.toLowerCase() === tokenAddress.toLowerCase()
        ? pairInfo.token1
        : pairInfo.token0

    if (
      !Object.values(
        SUPPORTED_PAIR_TOKENS[chainId as keyof typeof SUPPORTED_PAIR_TOKENS]
      ).find((token) => token.toLowerCase() === pairToken.toLowerCase())
    ) {
      return toast.error("Invalid pair address")
    }

    const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)

    try {
      const { request: addAssetRequest } = await publicClient.simulateContract({
        account: walletClient?.account.address as `0x${string}`,
        address: chain?.lending as `0x${string}`,
        abi: lendingAbi,
        functionName: "addToken",
        args: [
          tokenAddress as `0x${string}`,
          BigInt(assetWeight),
          pairAddress as `0x${string}`,
          isV2,
          pairToken as `0x${string}`,
        ],
      })
      const hash = await walletClient?.writeContract(addAssetRequest)
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
      })
      console.log(receipt)
      toast.success("Asset added successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.shortMessage ?? "Failed to add asset")
    }
  }

  return (
    <form className="flex flex-col gap-4 p-4 bg-white dark:bg-[#080811] rounded-xl mx-6">
      <NetworkDropdown selectedNetwork={chainId} onChange={setChainId} />
      <InputGroup
        label="Asset Address"
        type="text"
        id="token-address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder="0x..."
      />
      <InputGroup
        label="Asset Name"
        type="text"
        id="token-name"
        value={tokenInfo?.name ?? ""}
        onChange={() => {}}
        disabled
      />
      <InputGroup
        label="Asset Symbol"
        type="text"
        id="token-symbol"
        value={tokenInfo?.symbol ?? ""}
        onChange={() => {}}
        disabled
      />
      <InputGroup
        label="Asset Weight"
        type="text"
        id="asset-weight"
        value={assetWeight}
        onChange={(e) => setAssetWeight(e.target.value)}
        placeholder="100"
      />
      <InputGroup
        label="Pair Address"
        type="text"
        id="pair-address"
        value={pairAddress}
        onChange={(e) => setPairAddress(e.target.value)}
        placeholder="0x..."
      />
      <CheckBoxGroup selected={isV2} onChange={setIsV2} label="Is V2 Pair?" />
      <a
        onClick={onAddAsset}
        className="text-center rounded-xl text-sm border text-black border-[#33f693] hover:bg-transparent bg-[#33f693] hover:text-black dark:hover:text-[#eee] transition-all duration-150 cursor-pointer py-1.5 px-2 sm:px-3"
      >
        Add Asset
      </a>
    </form>
  )
}

export default AddAssetForm
