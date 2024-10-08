"use client"

import { DashboardHeader } from "@/components/dashboard/header";
import { bitgetTraderColumns, okxOrderColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OkxHistoryOrder } from "../analysis/page";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// export const metadata = constructMetadata({
//   title: "Traders – MoonCrypto",
//   description: "Find the best crypto trader.",
// });

export type BitgetTrader = {
  userApi: any[];
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
    const response = await fetch(`https://tdb.mooncryp.to/api/bitget/traders?traderId=${traderId}`)
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
      toast.error("An unknown error occurred, check console for more message");
    }
    console.error("Failed to fetch order data:", error);
    return [];
  }
}
// async function fetchBitgetTraders(traderId: string): Promise<{ data: BitgetTrader[]; pageCount: number; status: string }> {
// async function fetchBitgetTraders(traderId: string): Promise<{ data: BitgetTrader[]; status: string }> {
//   try {
//     const data = await getBitgetTraders(traderId);
//     console.log('getBitgetTraders data:', data);
//     return {data: data, status: 'success'};
//   } catch (error) {
//     console.error(error);
//     return { data: [], status: 'error' }
//   }
// }

export default function TradersPage() {
  const [bitgetTrader, setBitgetTrader] = useState<BitgetTrader[]>([]);
  const [okxOrder, setOkxOrder] = useState<OkxHistoryOrder[]>([]);
  const [traderId, setTraderId] = useState<string>('');
  const [okxOraderId, setOkxTraderId] = useState<string>('');
  const [userApiData, setUserApiData] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      setIsLoading(false);
    };

    fetchBitgetData();
  }, []);
  useEffect(() => {
    document.title = "Copy Trading – MoonCrypto";
  }, []);

  const {data:session} = useSession();
  useEffect(() => {
    if (!session?.user?.id || !isLoading) {
      // console.log('Session not loaded yet or user ID not available');
      return;
    }
    async function fetchUserApiData() {
      try {
        const response = await fetch('/api/userApi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session?.user.id }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("userApi data:", data)
          setUserApiData(data);
        } else {
          console.error('Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }

    fetchUserApiData();
  }, [session]);

  // const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/login");
  // }
  
  return (
    <>
      <DashboardHeader
        heading="Copy Trading"
        text=""
      />

      <div className="mb-4">
        <Card>
          <CardHeader>
            <CardTitle>My Copy Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View detailed statistics and performance metrics for your copytrading activities.
            </p>
            <Link href="/copy-trading/manage" className="mt-4 inline-flex items-center text-sm font-medium text-primary">
              Copy Overview
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight">Explore Traders</h2>
      {/* <div className='flex h-full w-full flex-col items-center justify-center'> */}
      <div className='overflow-x-auto'>
      {/* <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex"> */}
        <Tabs defaultValue="Bitget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="Bitget">Bitget</TabsTrigger>
            <TabsTrigger value="binance">Binance</TabsTrigger>
            <TabsTrigger value="okx">OKX</TabsTrigger>
            {/* <TabsTrigger value="favorites" className="bg-yellow-300 text-black hover:bg-yellow-400">Favorites</TabsTrigger> */}
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

            {isLoading ? (
              <div>
                <TableSkeleton />
              </div>
            ) : (
              <DataTable data={bitgetTrader} columns={bitgetTraderColumns} userApi={userApiData!} />
            )}
          </TabsContent>

          <TabsContent value="binance" className="space-y-4">
            <p className="text-sm text-muted-foreground">Binance trader data coming soon.</p>
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
            <p className="text-sm text-muted-foreground">OKX trader data coming soon.</p>
            <div>
              <form onSubmit={handleOKXSubmit}>
                {/* <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="okxTraderId" placeholder="Search OKX TraderId" className="pl-8" />
                </div> */}
              </form>
            </div>
            {/* <DataTable data={okxOrder} columns={okxOrderColumns} /> */}
          </TabsContent>
          <TabsContent value="favorites" className="space-y-4">
            <p className="text-sm text-muted-foreground">Coming soon.</p>
            <div>

            </div>
          </TabsContent>
        </Tabs>

      {/* </div> */}

      </div>
    </>
  );
}
