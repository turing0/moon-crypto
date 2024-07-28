"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tab, TabList, TabPanel, Tabs as Tabs2 } from "@/components/v2/tabs/tabs"
import { Search } from "lucide-react"
import { Suspense, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
// import { Input } from "@/components/ui/input-table"
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/table/data-table"
import { okxOrderColumns, orderColumns } from "@/components/table/columns"
import { DashboardHeader } from "@/components/dashboard/header"
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CopyTradeDialog } from "@/components/exchange/copy-trade-dialog"

// export const metadata = constructMetadata({
//   title: "Analysis – Moon Crypto",
//   description: "In-depth trader analysis.",
// });

export type BitGetHistoryOrder = {
  trackingNo: string;
  symbol: string;
  openOrderId: string;
  closeOrderId: string;
  posSide: string;
  openLeverage: string;
  openPriceAvg: string;
  openTime: string;
  openSize: string;
  closeSize: string;
  closeTime: string;
  closePriceAvg: string;
  openFee: string;
  closeFee: string;
  marginMode: string;
  followCount: string;
  marginAmount: string;
  cTime: string;
  traderId: string;
};
export type OkxHistoryOrder = {
  subPosId: string;
  ccy: string;
  closeAvgPx: string;
  closeTime: string;
  instId: string;
  instType: string;
  lever: string;
  margin: string;
  mgnMode: string;
  openAvgPx: string;
  openTime: string;
  pnl: string;
  pnlRatio: string;
  posSide: string;
  subPos: string;
  uniqueCode: string;
};

async function getBitgetHistoryOrder(traderId: string) {
  try {
    const response = await fetch(`https://tdb.mooncryp.to/api/bitget/order/history?traderId=${traderId}&pageSize=5000`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const {data, pageCount} = await response.json() as { data: BitGetHistoryOrder[], pageCount: number }
    console.log("getBitgetHistoryOrder:", data.length);
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
async function getBitgetTrader(traderId: string) {
  try {
    const response = await fetch(`https://tdb.mooncryp.to/api/bitget/traders?traderId=${traderId}`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const {data, pageCount} = await response.json() as { data: BitGetHistoryOrder[], pageCount: number }
    console.log("getBitgetTrader data:", data);
    
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
async function getOkxHistoryOrder(traderId: string) {
  try {
    const response = await fetch(`https://tdb.mooncryp.to/api/okx/order/history?uniqueCode=${traderId}&pageSize=5000`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const {data, pageCount} = await response.json() as { data: OkxHistoryOrder[], pageCount: number }
    console.log("getOkxHistoryOrder:", data.length);

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

// function SearchBar({name, placeholder}) {
//   const searchParams = useSearchParams()
//   const bitgetTraderId = searchParams.get('bitgetTraderId')
//   const binanceTraderId = searchParams.get('binanceTraderId')
//   const okxTraderId = searchParams.get('okxTraderId')

//   // const defaultValue = name=="bitgetTraderId" ? 
//   //     bitgetTraderId??"" : 
//   //     (name=="binanceTraderId" ? binanceTraderId??"" : okxTraderId??"");
//   const defaultValue = searchParams.get(name) || ""
//   // const search = searchParams.get('search')
 
//   // This will not be logged on the server when using static rendering
//   console.log("SearchBar searchParams:", searchParams)
 
//   return <>                
//     <div className="relative">
//     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//     <Input name={name} placeholder={placeholder} defaultValue={defaultValue} className="pl-8" />
//   </div>
//   </>
// }

interface SearchParams {
  // [key: string]: string | string[] | undefined
  [key: string]: string | undefined
}
export interface IndexPageProps {
  searchParams: SearchParams
}
export default function AnalysisPage({ searchParams }: IndexPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  // const search = searchParamsSchema.parse(searchParams)
  console.log("searchParams", searchParams)
  // console.log("pathname", pathname)

  const bitgetTraderIdParam = searchParams.bitgetTraderId
  const binanceTraderIdParam = searchParams.binanceTraderId
  const okxTraderIdParam = searchParams.okxTraderId

  const [traderInfo, setTraderInfo] = useState<any>();
  const [bitgetOrder, setBitgetOrder] = useState<BitGetHistoryOrder[]>([]);
  // const [binanceOrder, setBinanceOrder] = useState<BinanceHistoryOrder[]>([]);
  const [okxOrder, setOkxOrder] = useState<OkxHistoryOrder[]>([]);
  const [bitgetTraderId, setBitgetTraderId] = useState<string>(bitgetTraderIdParam?bitgetTraderIdParam:'');
  const [okxTraderId, setOkxTraderId] = useState<string>(okxTraderIdParam?okxTraderIdParam:'');
  const [isLoading, setIsLoading] = useState<boolean>(bitgetTraderId?true:false);

  // const searchParams = useSearchParams()
  // const bitgetTraderId = searchParams.get('bitgetTraderId')
  // const okxTraderId = searchParams.get('okxTraderId')
  // console.log("params:", searchParams)

  const defaultTabValue = okxTraderIdParam ? "okx":"bitget";

  // useEffect(() => {
  //   if (bitgetTraderIdParam) {
  //     setBitgetTraderId(bitgetTraderIdParam);
  //   }
  //   if (okxTraderIdParam) {
  //     setOkxTraderId(okxTraderIdParam);
  //   }
  // }, [bitgetTraderIdParam, okxTraderIdParam]);
  // useEffect(() => {
  //   if (okxTraderId) {
  //     setOkxTraderId(okxTraderId);
  //   }
  // }, [okxTraderId]);
  // const bitGetSearchBar = useMemo(
  //   () => (
  //     <SearchBar name="bitgetTraderId" placeholder="Search Bitget TraderId" />
  //   ),
  //   []
  // )
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBitgetTraderId(event.target.value);
  };

  useEffect(() => {
    document.title = "Analysis – Moon Crypto";
  }, []);

  useEffect(() => {
    if (bitgetTraderId) {
      getBitgetTrader(bitgetTraderId).then(data => {
        if (data.length > 0) {
          setTraderInfo(data[0])
        }
      })
      getBitgetHistoryOrder(bitgetTraderId).then(data => {
        setBitgetOrder(data);
        setIsLoading(false);
      });
      // router.replace(`${pathname}?${newSearchParams.toString()}`, {
      router.replace(`${pathname}?bitgetTraderId=${bitgetTraderId}`, {
        scroll: false,
      })
    }
  }, [bitgetTraderId]);
  useEffect(() => {
    if (okxTraderId) {
      getOkxHistoryOrder(okxTraderId).then(data => {
        setOkxOrder(data);
        setIsLoading(false);
      });
      router.replace(`${pathname}?okxTraderId=${okxTraderId}`, {
        scroll: false,
      });
    }
  }, [okxTraderId]);

  const handleBitgetOrderSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const id = formData.get('bitgetTraderId') as string;
    setBitgetTraderId(id);
  };
  // const tasks = await getBitgetHistoryOrder()
  const handleOKXSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const id = formData.get('okxTraderId') as string;
    setOkxTraderId(id);
  };
  
  return (
    // <DashboardShell>
    <>
      <DashboardHeader
        heading="Analysis"
      />
      <div className="overflow-x-auto">
      {/* <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex"> */}
        <Tabs defaultValue={defaultTabValue} className="space-y-4">
        {/* <Tabs defaultValue="bitget" className="space-y-4"> */}
          <TabsList>
            <TabsTrigger value="bitget">Bitget</TabsTrigger>
            <TabsTrigger value="binance">Binance</TabsTrigger>
            <TabsTrigger value="okx">OKX</TabsTrigger>
          </TabsList>
          <TabsContent value="bitget" className="space-y-4">
            {/* <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
            <div>
              {/* <form onSubmit={handleBitgetOrderSubmit}> */}
              <form>
                {/* <Suspense fallback={<SearchBarFallback />}>
                  <SearchBar name="bitgetTraderId" placeholder="Search Bitget TraderId" />
                </Suspense> */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="bitgetTraderId" placeholder="Search Bitget TraderId" defaultValue={bitgetTraderIdParam} className="pl-8" />
                </div>
              </form>
            </div>
            
            {traderInfo && (
              <Card className="w-full rounded-lg bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={traderInfo['traderPic']} alt="John Doe" />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">{traderInfo['traderName']}</h3>
                      <p className="text-sm text-muted-foreground">Experienced trader with a keen eye for market trends.</p>
                    </div>
                  </div>
                  {/* <CopyTradeDialog traderId={bitgetTraderId} traderName={traderInfo['traderName']} userApi={[]} /> */}
                </div>
              </Card>
            )
            }

            <Tabs2 defaultValue="order">
              <TabList>
                <Tab value="overview">Overview</Tab>
                <Tab value="order">
                  <div className="flex items-center">
                    <p>History Order</p>
                  </div>
                </Tab>
                {/* <Tab value={TabSections.Roles}>Organization Roles</Tab> */}
              </TabList>
              <TabPanel value="overview">
                  Coming soon
              </TabPanel>
              <TabPanel value="order">
                {isLoading ? (
                  <div>
                    <TableSkeleton />
                  </div>
                ) : (
                  <>
                    <DataTable data={bitgetOrder} columns={orderColumns} />
                  </>
                )}
              </TabPanel>
              {/* <TabPanel value={TabSections.Roles}>
                Roles
              </TabPanel> */}
            </Tabs2>
          </TabsContent>

          <TabsContent value="binance" className="space-y-4">
            <div >
              {/* <form onSubmit={handleBinanceSubmit}> */}
              <form>
                {/* <Suspense fallback={<SearchBarFallback />}>
                  <SearchBar name="binanceTraderId" placeholder="Search Binance TraderId" />
                </Suspense> */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="binanceTraderId" placeholder="Search Binance TraderId" className="pl-8" />
                </div>
              </form>
            </div>
            {/* <DataTable data={binanceOrder} columns={binanceOrderColumns} /> */}
          </TabsContent>
          <TabsContent value="okx" className="space-y-4">
            <div >
              {/* <form onSubmit={handleOKXSubmit}> */}
              <form>
                {/* <Suspense fallback={<SearchBarFallback />}>
                  <SearchBar name="okxTraderId" placeholder="Search OKX TraderId" />
                </Suspense> */}
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="okxTraderId" placeholder="Search OKX TraderId" defaultValue={okxTraderIdParam} className="pl-8" />
                </div>
              </form>
            </div>
            <DataTable data={okxOrder} columns={okxOrderColumns} />
          </TabsContent>
        </Tabs>

        {/* <Separator/> */}
        
      {/* </div> */}
    </div>
    </>
  )
}
