"use client"

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import React, { useState } from "react"
import CurrencyInputGroup from "./CurrencyInputGroup"
import {
  useAccount,
  useBalance,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi"
import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "@/constants"
import { erc20Abi, formatUnits, parseUnits, zeroAddress } from "viem"
import { formatNumberUnit, min } from "@/utils"
import useAccountLendingInfo from "@/constants/useAccountLendingInfo"
import usePrices from "@/hooks/usePrices"
import useTotalLendingInfo from "@/constants/useTotalLendingInfo"
import lendingAbi from "@/abi/lendingAbi"
import toast from "react-hot-toast"

interface LendingModalProps {
  symbol: string
  open: boolean
  onClose: () => void
}

const LendingModal: React.FC<LendingModalProps> = ({
  symbol,
  open,
  onClose,
}) => {
  const chainId = useChainId()
  const [activeTab, setActiveTab] = useState("Deposit")
  const [amount, setAmount] = useState("0")
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [loading, setLoading] = useState(false)

  const asset = SUPPORTED_ASSETS.find((asset) => asset.symbol === symbol)
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId)
  const decimals = asset?.decimals?.[chainId] ?? 18
  const pricePrecision =
    18 - ((asset?.decimals?.[chainId] ?? 18) - (chain?.precision ?? 18))

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    token:
      asset?.addresses[chainId] === zeroAddress
        ? undefined
        : (asset?.addresses[chainId] as `0x${string}`),
    chainId: chainId,
    query: {
      enabled: !!address && !!asset?.addresses[chainId] && !!open,
      refetchInterval: 1000,
    },
  })

  const prices = usePrices()
  const price = Number(formatUnits(prices?.[symbol] ?? 0n, pricePrecision))

  const { totalBorrowed, totalCollateral, deposits, borrows } =
    useAccountLendingInfo()
  const { reserves, utilizations, borrowRates } = useTotalLendingInfo()

  const borrowRate = borrowRates?.[symbol] ?? 0n
  const depositRate =
    (borrowRate * (utilizations?.[symbol] ?? 0n)) / BigInt(1e18)

  const onMax = () => {
    if (activeTab === "Deposit") {
      setAmount(formatUnits(balance?.value ?? 0n, balance?.decimals ?? 18))
    } else if (activeTab === "Borrow") {
      const maxBorrowable =
        ((((totalCollateral ?? 0n) * 80n) / 100n - (totalBorrowed ?? 0n)) *
          BigInt(1e18)) /
        (prices?.[symbol] ?? 0n)
      setAmount(
        formatUnits(min(maxBorrowable, reserves?.[symbol] ?? 0n), decimals)
      )
    } else if (activeTab === "Withdraw") {
      const maxWithdrawable =
        (((((totalCollateral ?? 0n) - ((totalBorrowed ?? 0n) * 100n) / 80n) *
          100n) /
          BigInt((asset?.weight ?? 0) * 100)) *
          BigInt(1e18)) /
        (prices?.[symbol] ?? 0n)
      setAmount(
        formatUnits(min(maxWithdrawable, deposits?.[symbol] ?? 0n), decimals)
      )
    } else if (activeTab === "Repay") {
      setAmount(
        formatUnits(
          min(borrows?.[symbol] ?? 0n, balance?.value ?? 0n),
          decimals
        )
      )
    }
  }

  const onDeposit = async () => {
    if (!address || !walletClient || !publicClient) return
    try {
      const token = asset?.addresses[chainId] as `0x${string}`
      const parsedAmount = parseUnits(amount, decimals)
      setLoading(true)
      if (token === zeroAddress) {
        const { request: withdrawRequest } =
          await publicClient.simulateContract({
            account: address as `0x${string}`,
            address: chain?.lending as `0x${string}`,
            abi: lendingAbi,
            functionName: "deposit",
            args: [token, parsedAmount],
            value: parsedAmount,
          })
        const withdrawTx = await walletClient.writeContract(withdrawRequest)
        const withdrawReceipt = await publicClient.waitForTransactionReceipt({
          hash: withdrawTx,
        })
        console.log(withdrawReceipt)
      } else {
        const allowance = await publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as `0x${string}`, chain?.lending as `0x${string}`],
        })
        if (allowance < parsedAmount) {
          const { request: approveRequest } =
            await publicClient.simulateContract({
              account: address as `0x${string}`,
              address: token,
              abi: erc20Abi,
              functionName: "approve",
              args: [chain?.lending as `0x${string}`, parsedAmount],
            })
          const approveTx = await walletClient.writeContract(approveRequest)
          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: approveTx,
          })
          console.log(approveReceipt)
        }
        const { request: depositRequest } = await publicClient.simulateContract(
          {
            account: address as `0x${string}`,
            address: chain?.lending as `0x${string}`,
            abi: lendingAbi,
            functionName: "deposit",
            args: [token, parsedAmount],
          }
        )
        const depositTx = await walletClient.writeContract(depositRequest)
        const depositReceipt = await publicClient.waitForTransactionReceipt({
          hash: depositTx,
        })
        console.log(depositReceipt)
      }
      toast.success("Deposit successful", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "Deposit failed", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
    } finally {
      setLoading(false)
    }
  }

  const onBorrow = async () => {
    if (!address || !walletClient || !publicClient) return
    try {
      const token = asset?.addresses[chainId] as `0x${string}`
      const parsedAmount = parseUnits(amount, decimals)
      setLoading(true)
      const { request: borrowRequest } = await publicClient.simulateContract({
        account: address as `0x${string}`,
        address: chain?.lending as `0x${string}`,
        abi: lendingAbi,
        functionName: "borrow",
        args: [token, parsedAmount],
      })
      const borrowTx = await walletClient.writeContract(borrowRequest)
      const borrowReceipt = await publicClient.waitForTransactionReceipt({
        hash: borrowTx,
      })
      console.log(borrowReceipt)
      toast.success("Borrow successful", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "Borrow failed", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const onWithdraw = async () => {
    if (!address || !walletClient || !publicClient) return
    try {
      const token = asset?.addresses[chainId] as `0x${string}`
      const parsedAmount = parseUnits(amount, decimals)
      setLoading(true)
      const { request: withdrawRequest } = await publicClient.simulateContract({
        account: address as `0x${string}`,
        address: chain?.lending as `0x${string}`,
        abi: lendingAbi,
        functionName: "withdraw",
        args: [token, parsedAmount],
      })
      const withdrawTx = await walletClient.writeContract(withdrawRequest)
      const withdrawReceipt = await publicClient.waitForTransactionReceipt({
        hash: withdrawTx,
      })
      console.log(withdrawReceipt)
      toast.success("Withdraw successful", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "Withdraw failed", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const onRepay = async () => {
    if (!address || !walletClient || !publicClient) return
    try {
      const token = asset?.addresses[chainId] as `0x${string}`
      const parsedAmount = parseUnits(amount, decimals)
      setLoading(true)
      if (token === zeroAddress) {
        const { request: repayRequest } = await publicClient.simulateContract({
          account: address as `0x${string}`,
          address: chain?.lending as `0x${string}`,
          abi: lendingAbi,
          functionName: "repay",
          args: [token, parsedAmount],
          value: parsedAmount,
        })
        const repayTx = await walletClient.writeContract(repayRequest)
        const repayReceipt = await publicClient.waitForTransactionReceipt({
          hash: repayTx,
        })
        console.log(repayReceipt)
      } else {
        const allowance = await publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: "allowance",
          args: [address as `0x${string}`, chain?.lending as `0x${string}`],
        })
        if (allowance < parsedAmount) {
          const { request: approveRequest } =
            await publicClient.simulateContract({
              account: address as `0x${string}`,
              address: token,
              abi: erc20Abi,
              functionName: "approve",
              args: [chain?.lending as `0x${string}`, parsedAmount],
            })
          const approveTx = await walletClient.writeContract(approveRequest)
          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: approveTx,
          })
          console.log(approveReceipt)
        }
        const { request: repayRequest } = await publicClient.simulateContract({
          account: address as `0x${string}`,
          address: chain?.lending as `0x${string}`,
          abi: lendingAbi,
          functionName: "repay",
          args: [token, parsedAmount],
        })
        const repayTx = await walletClient.writeContract(repayRequest)
        const repayReceipt = await publicClient.waitForTransactionReceipt({
          hash: repayTx,
        })
        console.log(repayReceipt)
      }
      toast.success("Repay successful", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
    } catch (err: any) {
      toast.error(err?.shortMessage ?? "Repay failed", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      })
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const onAction = () => {
    if (activeTab === "Deposit") {
      onDeposit()
    } else if (activeTab === "Borrow") {
      onBorrow()
    } else if (activeTab === "Withdraw") {
      onWithdraw()
    } else if (activeTab === "Repay") {
      onRepay()
    }
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
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="flex flex-col w-full max-w-md h-[540px] rounded-xl bg-[#eee] dark:bg-[#10101a] p-4 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="flex items-center justify-between p-1.5 space-x-1.5 rounded-xl border border-[#1f3a55]">
              {["Deposit", "Borrow", "Withdraw", "Repay"].map((tab) => (
                <button
                  key={tab}
                  data-active={activeTab === tab}
                  className="w-full cursor-pointer py-1 text-[#0f59d1] dark:text-[#eee] data-[active=true]:bg-[#0f59d1] data-[active=true]:text-[#eee] dark:data-[active=true]:bg-[#eee] dark:data-[active=true]:text-[#10101a] rounded-lg"
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <CurrencyInputGroup
              onMax={onMax}
              value={amount}
              setValue={setAmount}
              symbol={symbol}
              price={price ?? 0}
              className="mt-4"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm">
                Balance{" "}
                {formatNumberUnit(
                  Number(
                    formatUnits(balance?.value ?? 0n, balance?.decimals ?? 18)
                  )
                )}{" "}
                {symbol}
              </span>
              <span className="text-sm">
                {activeTab === "Deposit" || activeTab === "Withdraw"
                  ? "Deposited"
                  : "Borrowed"}
                :{" "}
                {formatNumberUnit(
                  Number(
                    formatUnits(
                      activeTab === "Deposit" || activeTab === "Withdraw"
                        ? (deposits?.[symbol] ?? 0n)
                        : (borrows?.[symbol] ?? 0n),
                      decimals
                    )
                  )
                )}{" "}
                {symbol}
              </span>
            </div>
            <div className="w-full border-b-2 border-b-[#d0d7df] dark:border-[#1f3a55] my-4" />
            <div className="flex items-center justify-between text-sm">
              <span>Price</span>
              <span>
                $
                {price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Weight</span>
              <span>{asset?.weight}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>
                {activeTab === "Deposit" || activeTab === "Withdraw"
                  ? "Deposit APR"
                  : "Borrow APR"}
              </span>
              <span>
                {(
                  Number(
                    formatUnits(
                      activeTab === "Deposit" || activeTab === "Withdraw"
                        ? depositRate
                        : borrowRate,
                      18
                    )
                  ) * 100
                ).toFixed(2)}
                %
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Borrow Limit</span>
              <span>
                $
                {formatNumberUnit(
                  Number(formatUnits(totalCollateral ?? 0n, decimals))
                )}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span>Your Borrowed</span>
              <span>
                $
                {formatNumberUnit(
                  Number(formatUnits(totalBorrowed ?? 0n, decimals))
                )}
              </span>
            </div>
            <button
              className="w-full rounded-lg border text-[#0f59d1] dark:text-[#eee] border-[#d0d7df] dark:border-[#eee] hover:bg-[#0f59d1] dark:hover:bg-[#eee] bg-[#f8f9fd] dark:bg-transparent hover:text-[#eee] dark:hover:text-[#10101a] transition-all duration-150 cursor-pointer py-2 px-3 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onAction}
              disabled={loading}
            >
              {loading ? "Processing..." : activeTab}
            </button>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default LendingModal
