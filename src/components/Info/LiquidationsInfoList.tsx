"use client";

import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "@/constants";
import { getTokenImage } from "@/utils";

import Image from "next/image";
import { formatUnits } from "viem";
import StyledAddress from "../StyledAddress";
import { useState } from "react";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import lendingAbi from "@/abi/lendingAbi";
import toast from "react-hot-toast";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

const LiquidationsInfoList = () => {
  const [liquidating, setLiquidating] = useState(false);
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
  // const { data: liquidationsInfo } = useQuery({
  //   queryKey: ["liquidations-info"],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/info/liquidations`
  //     );
  //     return data.data;
  //   },
  //   refetchInterval: 60000,
  // })

  const liquidationsInfo = [
    {
      chain: 1,
      user: "0x1234567890123456789012345678901234567890",
      borrowCapacity: "1000000000000000000",
      totalDebt: "1000000000000000000",
      indebtedness: "1000000000000000000",

      brrowsWithCurrentDebt: [
        {
          debtToken: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
          currentDebt: "1000000000000000000",
        },
      ],
      deposits: [
        {
          chain: 1,
          symbol: "USDC",
          amount: "1000000000000000000",
        },
      ],
    },
  ];

  const handleLiquidate = async (liquidation: any) => {
    if (!address || !walletClient || !publicClient) return;
    setLiquidating(true);
    try {
      const debtToken = liquidation.brrowsWithCurrentDebt[0].debtToken;
      const debtTokenInfo = SUPPORTED_ASSETS.find(
        (token) =>
          (token.addresses as any)[liquidation.chain]?.toLowerCase() ===
          debtToken.toLowerCase()
      );
      const collateralToken = liquidation.deposits[0].symbol;
      const collateralTokenInfo = SUPPORTED_ASSETS.find(
        (token) => token.symbol === collateralToken
      );
      const collateralTokenAddress = collateralTokenInfo
        ? ((collateralTokenInfo.addresses as any)?.[liquidation.chain] ??
          (collateralTokenInfo.addresses as any)?.[
            liquidation.deposits[0].chain
          ])
        : null;
      const { request: liquidateRequest } = await publicClient.simulateContract(
        {
          account: address as `0x${string}`,
          address: chain?.lending as `0x${string}`,
          abi: lendingAbi,
          functionName: "liquidate",
          args: [
            liquidation.user as `0x${string}`,
            debtToken as `0x${string}`,
            BigInt(liquidation.totalDebt),
            collateralTokenAddress as `0x${string}`,
          ],
        }
      );
      const liquidateTx = await walletClient.writeContract(liquidateRequest);
      const liquidateReceipt = await publicClient.waitForTransactionReceipt({
        hash: liquidateTx,
      });
      console.log(liquidateReceipt);
      toast.success("Liquidation successful", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      });
    } catch (error: any) {
      toast.error(error?.shortMessage ?? "Liquidation failed", {
        className:
          "bg-[#080811]! text-white! dark:bg-[#e9f2fd]! dark:text-black! text-sm! py-3! px-6!",
      });
      console.error(error);
    } finally {
      setLiquidating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {liquidationsInfo?.map((liquidation: any, index: number) => {
        const firstBorrow = liquidation.brrowsWithCurrentDebt?.[0];
        const debtToken = firstBorrow?.debtToken;
        const debtTokenInfo = debtToken
          ? SUPPORTED_ASSETS.find(
              (token) =>
                (token.addresses as any)[liquidation.chain]?.toLowerCase() ===
                debtToken.toLowerCase()
            )
          : null;

        const firstDeposit = liquidation.deposits?.[0];
        const collateralAsset = firstDeposit
          ? SUPPORTED_ASSETS.find((a) => a.symbol === firstDeposit.symbol)
          : null;
        const collateralTokenAddress = collateralAsset
          ? ((collateralAsset.addresses as any)?.[liquidation.chain] ??
            (collateralAsset.addresses as any)?.[firstDeposit.chain])
          : undefined;

        return (
          <div
            key={`${liquidation.user}-${liquidation.chain}-${index}`}
            className={`p-4 bg-white dark:bg-[#080811] rounded-xl`}
          >
            <div className="flex items-center flex-wrap justify-between">
              <div className="flex items-center">
                <div className="flex items-end">
                  <Image
                    src={
                      getTokenImage(
                        liquidation.chain,
                        (collateralTokenAddress ??
                          debtToken ??
                          "") as `0x${string}`
                      ) ?? ""
                    }
                    alt={firstDeposit?.symbol ?? debtTokenInfo?.symbol ?? ""}
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full"
                  />
                  <Image
                    src={
                      SUPPORTED_CHAINS.find(
                        (chain) => chain.id === liquidation.chain
                      )?.icon ?? ""
                    }
                    alt={String(liquidation.chain ?? "")}
                    width={100}
                    height={100}
                    className="w-5 h-5 rounded-full -ml-3"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">
                    {firstDeposit?.symbol ?? "Collateral"} Liquidations
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-2 max-md:order-2 max-md:mt-4">
                <button
                  type="button"
                  onClick={() => handleLiquidate(liquidation)}
                  className={`text-sm border text-black border-[#33f693] hover:bg-transparent bg-[#33f693] hover:text-black dark:hover:text-[#eee] transition-all duration-150 cursor-pointer py-1.5 px-2 sm:px-3 ${liquidating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {liquidating ? "Liquidating..." : "Liquidate"}
                </button>
              </div>
              <div className="flex max-md:flex-col items-center justify-between w-full mt-5">
                <div className="flex md:flex-col w-full max-md:justify-between items-center md:items-start md:border-r border-[#afafaf7a] dark:border-[#d2d2d212]">
                  <span className="text-sm opacity-60">Borrower</span>
                  <span className="font-bold mt-1">
                    <StyledAddress address={liquidation.user} />
                  </span>
                </div>
                <div className="flex md:flex-col items-center w-full max-md:justify-between md:border-r border-[#afafaf7a] dark:border-[#d2d2d212]">
                  <span className="text-sm opacity-60">Borrowed</span>
                  <span className="font-bold mt-1">
                    {debtTokenInfo
                      ? `${formatUnits(
                          liquidation.totalDebt,
                          (debtTokenInfo.decimals as any)?.[
                            liquidation.chain
                          ] ?? 18
                        )} ${debtTokenInfo.symbol}`
                      : formatUnits(liquidation.totalDebt, 18)}
                  </span>
                </div>
                <div className="flex md:flex-col items-center md:items-end w-full max-md:justify-between">
                  <span className="text-sm opacity-60">Collateral</span>
                  <span className="font-bold mt-1">
                    {firstDeposit && collateralAsset
                      ? `${formatUnits(
                          firstDeposit.amount,
                          (collateralAsset.decimals as any)?.[
                            firstDeposit.chain ?? liquidation.chain
                          ] ?? 18
                        )} ${firstDeposit.symbol}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiquidationsInfoList;
