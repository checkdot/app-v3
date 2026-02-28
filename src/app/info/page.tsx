import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import DepositsInfoList from "@/components/Info/DepositsInfoList";
import BorrowsInfoList from "@/components/Info/BorrowsInfoList";
import LiquidationsInfoList from "@/components/Info/LiquidationsInfoList";

const InfoPage = () => {
  return (
    <div className="mt-20 px-4">
      <TabGroup>
        <TabList className="flex">
          <Tab className="cursor-pointer py-1 px-4 text-[#0f59d1] dark:text-[#eee] data-selected:bg-[#0f59d1] data-selected:text-[#eee] dark:data-selected:bg-[#eee] dark:data-selected:text-[#10101a] rounded-lg">
            Deposits
          </Tab>
          <Tab className="cursor-pointer py-1 px-4 text-[#0f59d1] dark:text-[#eee] data-selected:bg-[#0f59d1] data-selected:text-[#eee] dark:data-selected:bg-[#eee] dark:data-selected:text-[#10101a] rounded-lg">
            Borrows
          </Tab>
          <Tab className="cursor-pointer py-1 px-4 text-[#0f59d1] dark:text-[#eee] data-selected:bg-[#0f59d1] data-selected:text-[#eee] dark:data-selected:bg-[#eee] dark:data-selected:text-[#10101a] rounded-lg">
            Liquidations
          </Tab>
        </TabList>
        <TabPanels className="mt-3">
          <TabPanel>
            <DepositsInfoList />
          </TabPanel>
          <TabPanel>
            <BorrowsInfoList />
          </TabPanel>
          <TabPanel>
            <LiquidationsInfoList />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default InfoPage;
