"use client";

import { SUPPORTED_ASSETS, SUPPORTED_CHAINS } from "@/constants";
import { getTokenImage } from "@/utils";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
import Image from "next/image";
import { formatUnits } from "viem";
import StyledAddress from "../StyledAddress";

const DepositsInfoList = () => {
  // const { data: depositsInfo } = useQuery({
  //   queryKey: ["deposits-info"],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/info/deposits`
  //     );
  //     return data.data;
  //   },
  //   refetchInterval: 60000,
  // });

  const depositsInfo = [
    {
      chain: 1,
      user: "0x1234567890123456789012345678901234567890",
      token: "0xCdB37A4fBC2Da5b78aA4E41a432792f9533e85Cc",
      amount: "1000000000000000000",
      blockNumber: 1234567890,
    },
    {
      chain: 56,
      user: "0x1234567890123456789012345678901234567890",
      token: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      amount: "1000000000000000000",
      blockNumber: 1234567890,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {depositsInfo?.map((deposit: any) => {
        const assetInfo = SUPPORTED_ASSETS.find(
          (asset) =>
            (asset.addresses as any)[deposit.chain]?.toLowerCase() ===
            deposit.token.toLowerCase()
        );

        return (
          <div className={`p-4 bg-white dark:bg-[#080811] rounded-xl`}>
            <div className="flex items-center flex-wrap justify-between">
              <div className="flex items-center">
                <div className="flex items-end">
                  <Image
                    src={
                      getTokenImage(
                        deposit.chain,
                        deposit.token as `0x${string}`
                      ) ?? ""
                    }
                    alt={deposit.token ?? ""}
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full"
                  />
                  <Image
                    src={
                      SUPPORTED_CHAINS.find(
                        (chain) => chain.id === deposit.chain
                      )?.icon ?? ""
                    }
                    alt={deposit.chain ?? ""}
                    width={100}
                    height={100}
                    className="w-5 h-5 rounded-full -ml-3"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold">
                    {assetInfo?.symbol} Deposits
                  </h4>
                </div>
              </div>
              <div className="flex max-md:flex-col items-center justify-between w-full mt-5">
                <div className="flex md:flex-col w-full max-md:justify-between items-center md:items-start md:border-r border-[#afafaf7a] dark:border-[#d2d2d212]">
                  <span className="text-sm opacity-60">By</span>
                  <span className="font-bold mt-1">
                    <StyledAddress address={deposit.user} />
                  </span>
                </div>
                <div className="flex md:flex-col items-center w-full max-md:justify-between md:border-r border-[#afafaf7a] dark:border-[#d2d2d212]">
                  <span className="text-sm opacity-60">Amount</span>
                  <span className="font-bold mt-1">
                    {formatUnits(
                      deposit.amount,
                      (assetInfo?.decimals as any)?.[deposit.chain] ?? 18
                    )}{" "}
                    {assetInfo?.symbol}
                  </span>
                </div>
                <div className="flex md:flex-col items-center md:items-end w-full max-md:justify-between">
                  <span className="text-sm opacity-60">Block</span>
                  <span className="font-bold mt-1">{deposit.blockNumber}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DepositsInfoList;
