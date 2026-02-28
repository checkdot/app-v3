import LendingModal from "./LendingModal";
import { useState } from "react";
import { SUPPORTED_CHAINS } from "@/constants";
import { formatNumberUnit } from "@/utils";
import usePrices from "@/hooks/usePrices";
import useTotalLendingInfo from "@/hooks/useTotalLendingInfo";
import { formatUnits, zeroAddress } from "viem";
import { useChainId } from "wagmi";
import DepositsPanel from "./DepositsPanel";
import DepositAssetsPanel from "./DepositAssetsPanel";
import BorrowsPanel from "./BorrowsPanel";
import BorrowAssetsPanel from "./BorrowAssetsPanel";

const LendingAssetsList = () => {
  const [selectedAsset, setSelectedAsset] = useState<`0x${string}` | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<
    "Deposit" | "Borrow" | "Withdraw" | "Repay"
  >("Deposit");
  const chainId = useChainId();

  const chain = SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
  const prices = usePrices();
  const { reserves, deposits, borrows, supportedTokens, decimals } =
    useTotalLendingInfo();

  const statements = [
    {
      label: "Supported Assets",
      value: supportedTokens?.length ?? 0,
    },
    {
      label: "Total Reserves",
      value: `$${formatNumberUnit(
        Number(
          supportedTokens?.reduce(
            (acc, token) =>
              acc +
              Number(
                formatUnits(
                  reserves?.[token.toLowerCase() as `0x${string}`] ?? 0n,
                  decimals?.[token.toLowerCase() as `0x${string}`] ?? 18
                )
              ) *
                Number(
                  formatUnits(
                    prices?.[token.toLowerCase() as `0x${string}`] ?? 0n,
                    18 -
                      ((decimals?.[token.toLowerCase() as `0x${string}`] ??
                        18) -
                        (chain?.precision ?? 18))
                  )
                ),
            0
          )
        )
      )}`,
    },
    {
      label: "Total Deposits",
      value: `$${formatNumberUnit(
        Number(
          supportedTokens?.reduce(
            (acc, token) =>
              acc +
              Number(
                formatUnits(
                  deposits?.[token.toLowerCase() as `0x${string}`] ?? 0n,
                  decimals?.[token.toLowerCase() as `0x${string}`] ?? 18
                )
              ) *
                Number(
                  formatUnits(
                    prices?.[token.toLowerCase() as `0x${string}`] ?? 0n,
                    18 -
                      ((decimals?.[token.toLowerCase() as `0x${string}`] ??
                        18) -
                        (chain?.precision ?? 18))
                  )
                ),
            0
          )
        )
      )}`,
    },
    {
      label: "Total Borrows",
      value: `$${formatNumberUnit(
        Number(
          supportedTokens?.reduce(
            (acc, token) =>
              acc +
              Number(
                formatUnits(
                  borrows?.[token.toLowerCase() as `0x${string}`] ?? 0n,
                  decimals?.[token.toLowerCase() as `0x${string}`] ?? 18
                )
              ) *
                Number(
                  formatUnits(
                    prices?.[token.toLowerCase() as `0x${string}`] ?? 0n,
                    18 -
                      ((decimals?.[token.toLowerCase() as `0x${string}`] ??
                        18) -
                        (chain?.precision ?? 18))
                  )
                ),
            0
          )
        )
      )}`,
    },
  ];

  const onSelectTab = (tab: "Deposit" | "Borrow" | "Withdraw" | "Repay") => {
    return (token: `0x${string}`) => {
      setSelectedTab(tab);
      setSelectedAsset(token.toLowerCase() as `0x${string}`);
    };
  };

  return (
    <>
      <div>
        <div className="flex flex-wrap">
          {statements.map((item) => (
            <div key={item.label} className="p-2 w-full sm:w-1/2 md:w-1/4">
              <div className="p-4 bg-white dark:bg-[#080811]">
                <div className="text-center">{item.label}</div>
                <div className="text-center text-[#33f693] text-2xl font-bold mt-2">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex max-lg:flex-col">
          <div className="w-full lg:w-1/2 p-2">
            <DepositsPanel onSelectAsset={onSelectTab("Withdraw")} />
            <DepositAssetsPanel
              onSelectAsset={onSelectTab("Deposit")}
              className="mt-4"
            />
          </div>
          <div className="w-full lg:w-1/2 p-2">
            <BorrowsPanel onSelectAsset={onSelectTab("Repay")} />
            <BorrowAssetsPanel
              onSelectAsset={onSelectTab("Borrow")}
              className="mt-4"
            />
          </div>
        </div>
      </div>
      <LendingModal
        token={selectedAsset ?? zeroAddress}
        open={selectedAsset !== null}
        tab={selectedTab}
        onClose={() => setSelectedAsset(null)}
      />
    </>
  );
};

export default LendingAssetsList;
