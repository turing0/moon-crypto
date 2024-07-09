"use client"

import { OkxHistoryOrder } from "@/app/(marketing)/analysis/page";
import { bitgetTraderColumns, okxOrderColumns } from "@/app/_components/columns";
import { DataTable } from "@/app/_components/data-table";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type BitgetTrader = {
  canTrace: string;
  traderId: string;
  traderName: string;
  maxLimit: string;
  bgbMaxFollowLimit: string;
  followCount: string;
  bgbFollowCount: string;
  traderStatus: string;
  currentTradingList: string[];
  columnList: {
    describe: string;
    value: string;
  }[];
  totalFollowers: string;
  profitCount: string;
  lossCount: string;
  tradeCount: string;
  traderPic: string;
  maxCallbackRate: string;
  averageWinRate: string;
  dailyProfitRateList: {
    rate: string;
    cTime: string;
  }[];
  dailyProfitList: {
    amount: string;
    cTime: string;
  }[];
  followerTotalProfit: string;
  profitRate24hList: {
    rate: string;
    cTime: string;
  }[];
  profit24hList: {
    amount: string;
    cTime: string;
  }[];
  lastTradeTime: string;
  tradeDays: string;
};

async function getBitgetTraders(traderId: string) {
  try {
    const response = await fetch(`https://45.77.180.194:8000/api/bitget/traders?traderId=${traderId}`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const {data, pageCount} = await response.json() as { data: BitgetTrader[], pageCount: number }
    console.log("getBitgetTraders:", data.length);
    // toast.error("Fake An unknown error occurred, check console for more message", {
    //   description: "Your name was not updated. Please try again.",
    //   position: "top-center",
    //   duration: 5000,
    //   // cancel: {
    //   //   label: 'Cancel',
    //   //   onClick: () => console.log('Cancel!'),
    //   // },
    // });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred, check console for more message", {
        position: "top-center",
      });
    }
    console.error("Failed to fetch order data:", error);
    return [];
  }
}

export default function TradersPage() {
  const [bitgetTrader, setBitgetTrader] = useState<BitgetTrader[]>([]);
  const [okxOrder, setOkxOrder] = useState<OkxHistoryOrder[]>([]);
  const [traderId, setTraderId] = useState<string>('');
  const [okxOraderId, setOkxTraderId] = useState<string>('');
  
  const handleOKXSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const id = formData.get('okxTraderId') as string;
    setOkxTraderId(id);
  };

  useEffect(() => {
    const fetchBitgetData = async () => {
      const bitgetdata = await getBitgetTraders("");
      console.log("bitgetdata:", bitgetdata);
      setBitgetTrader(bitgetdata);
    };

    fetchBitgetData();
  }, []);
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Traders"
        text=""
      />
      {/* <div className='flex h-full w-full flex-col items-center justify-center'> */}
      <div className=''>
        
      {/* <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex"> */}
        <Tabs defaultValue="Bitget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="Bitget">Bitget</TabsTrigger>
            <TabsTrigger value="binance">Binance</TabsTrigger>
            <TabsTrigger value="okx">OKX</TabsTrigger>
          </TabsList>
          <TabsContent value="Bitget" className="space-y-4">
            {/* <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
            {/* <div>
              <form onSubmit={handleBitgetOrderSubmit}>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="bitgetTraderId" placeholder="Search Bitget TraderId" className="pl-8" />
                </div>
              </form>
            </div> */}
            <DataTable data={bitgetTrader} columns={bitgetTraderColumns} />
          </TabsContent>
          <TabsContent value="binance" className="space-y-4">
            <div >
              {/* <form onSubmit={handleBinanceSubmit}> */}
              <form>
                {/* <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="binanceTraderId" placeholder="Search Binance TraderId" className="pl-8" />
                </div> */}
              </form>
            </div>
            {/* <DataTable data={binanceOrder} columns={binanceOrderColumns} /> */}
          </TabsContent>
          <TabsContent value="okx" className="space-y-4">
            <div>
              <form onSubmit={handleOKXSubmit}>
                {/* <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="okxTraderId" placeholder="Search OKX TraderId" className="pl-8" />
                </div> */}
              </form>
            </div>
            <DataTable data={okxOrder} columns={okxOrderColumns} />
          </TabsContent>
        </Tabs>


      {/* </div> */}

      </div>
    </DashboardShell>
  );
}
