"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tab, TabList, TabPanel, Tabs as Tabs2 } from "@/components/v2/tabs/tabs"
import { Search } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
// import { Input } from "@/components/ui/input-table"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/table/data-table"
import { bitgetCurrentOrderColumns, okxOrderColumns, orderColumns } from "@/components/table/columns"
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"

// export const metadata = constructMetadata({
//   title: "Analysis – MoonCrypto",
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
export type BitGetCurrentOrder = {
  trackingNo: string;
  symbol: string;
  openOrderId: string;
  posSide: string;
  openLeverage: string;
  openPriceAvg: string;
  openTime: string;
  openSize: string;
  openFee: string;
  marginMode: string;
  followCount: string;
  marginAmount: string;
  stopSurplusPrice: string;
  stopLossPrice	: string;
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
      toast.error("An unknown error occurred, check console for more message");
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
    const {data, pageCount} = await response.json() as { data: any[], pageCount: number }
    console.log("getBitgetTrader data:", data);
    
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
      toast.error("An unknown error occurred, check console for more message");
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
export interface AnalysisPageProps {
  searchParams: SearchParams
}
export default function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  // const search = searchParamsSchema.parse(searchParams)
  console.log("searchParams", searchParams)
  // console.log("pathname", pathname)

  const bitgetTraderIdParam = searchParams.bitgetTraderId
  const binanceTraderIdParam = searchParams.binanceTraderId
  const okxTraderIdParam = searchParams.okxTraderId

  const [trader, setTrader] = useState<any>(undefined);
  const [bitgetHistoryOrder, setBitgetHistoryOrder] = useState<BitGetHistoryOrder[] | undefined>(undefined);
  const [bitgetCurrentOrder, setBitgetCurrentOrder] = useState<BitGetCurrentOrder[]>([]);
  // const [binanceOrder, setBinanceOrder] = useState<BinanceHistoryOrder[]>([]);
  const [okxOrder, setOkxOrder] = useState<OkxHistoryOrder[]>([]);
  const [bitgetTraderId, setBitgetTraderId] = useState<string>(bitgetTraderIdParam?bitgetTraderIdParam:'');
  const [okxTraderId, setOkxTraderId] = useState<string>(okxTraderIdParam?okxTraderIdParam:'');
  const [isCurrentOrderLoading, setIsCurrentOrderLoading] = useState<boolean>(bitgetTraderId?true:false);

  // const searchParams = useSearchParams()
  // const bitgetTraderId = searchParams.get('bitgetTraderId')
  // const okxTraderId = searchParams.get('okxTraderId')
  // console.log("params:", searchParams)

  const defaultTabValue = bitgetTraderIdParam?"bitget": (binanceTraderIdParam?"binance":"okx");

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
    if (bitgetTraderId) {
      getBitgetTrader(bitgetTraderId).then(data => {
        if (data.length > 0) {
          setTrader(data[0]);
          document.title = `${data[0]['traderName']} - Analysis – MoonCrypto`;
        } else {
          setTrader([]);
          document.title = `Analysis – MoonCrypto`;
        }
      })
      // getBitgetHistoryOrder(bitgetTraderId).then(data => {
      //   setBitgetHistoryOrder(data);
      //   setIsLoading(false);
      // });
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
      });
      router.replace(`${pathname}?okxTraderId=${okxTraderId}`, {
        scroll: false,
      });
    }
  }, [okxTraderId]);

  const getBitgetHistoryData = async () => {
    if (bitgetHistoryOrder) {
      return
    }
    try {
      getBitgetHistoryOrder(bitgetTraderId).then(data => {
        setBitgetHistoryOrder(data);
      });
    } catch (error) {
      console.error('Error getBitgetHistoryData:', error);
    }
  };

  const getActiveOrders = async () => {
    if (!bitgetTraderId) {
      return
    }
    setIsCurrentOrderLoading(true);
    try {
      const response = await fetch(`https://tdb.mooncryp.to/api/bitget/order/current?traderId=${bitgetTraderId}`);
      const data = await response.json();
      console.log("ActiveOrders data:", data)
      setBitgetCurrentOrder(data.data);
    } catch (error) {
      console.error('Error fetching active trades data:', error);
    } finally {
      setIsCurrentOrderLoading(false);
    }
  };
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
  // const handleCopyTrade = () => {
  //   router.push(`/copy-trading/add?bitgetTraderId=${bitgetTraderId}`);
  // };
  
  return (
    <>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <Link href="/copy-trading" className="mb-2 flex cursor-pointer items-center">
          <Icons.arrowLeft className="mr-1 h-4 w-4" />
          <span>Explor Traders</span>
        </Link>
      </div >
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
            
            {trader===undefined ? (
              <div className="flex h-40 w-full items-center justify-center">
                <Icons.spinner className="size-8 animate-spin text-gray-500" />
              </div>
            ) : trader.length === 0 ? (
              <div className="flex h-40 w-full flex-col items-center justify-center text-gray-500">
                {/* <Icons.alertTriangle className="w-8 h-8 mb-2 text-red-500" /> */}
                <p className="text-lg font-semibold">No Data Available</p>
                <p className="text-sm">Please check bitgetTraderId and try again.</p>
              </div>
            ) : (
              <>
              <Card className="w-full rounded-lg bg-background p-6 shadow-lg">
                {/* <div className="flex items-center justify-between"> */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={trader['traderPic']} alt="John Doe" />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{trader['traderName']}</h3>
                        <Link href={`https://www.bitget.com/zh-CN/copy-trading/trader/${bitgetTraderId}/futures`} target="_blank">
                          <Icons.exteralLink className="ml-2 size-4 cursor-pointer" />
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground">Experienced trader with a keen eye for market trends.</p>
                    </div>
                  </div>
                  {/* <CopyTradeDialog traderId={bitgetTraderId} traderName={traderInfo['traderName']} userApi={[]} /> */}
                  <div className="mt-4 sm:mt-0">
                    <Link href={`/copy-trading/add?bitgetTraderId=${bitgetTraderId}`}>
                      <Button className="w-full sm:w-auto sm:px-8">
                        Copy
                      </Button> 
                    </Link>
                  </div>
                </div>
              </Card>

              <Tabs2 defaultValue="overview">
                <TabList>
                  <Tab value="overview">Overview</Tab>
                  <Tab value="orders" onClick={getBitgetHistoryData}>
                    <div className="flex items-center">
                      <p>Orders</p>
                    </div>
                  </Tab>
                  {/* <Tab value={TabSections.Roles}>Organization Roles</Tab> */}
                </TabList>
                <TabPanel value="overview">
                  <div className="mx-auto">
                    {/* <div className="flex items-center mb-6">
                      <Avatar className="h-20 w-20 mr-4">
                        <AvatarImage src={trader.traderPic} alt={trader.traderName} />
                        <AvatarFallback>{trader.traderName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-3xl font-bold">{trader.traderName}</h1>
                        <p className="text-gray-500">Trader ID: {trader.traderId}</p>
                        <Badge variant={trader.traderStatus === "Yes" ? "default" : "destructive"}>
                          {trader.traderStatus === "Yes" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div> */}

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {trader.columnList.map((item, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle>{item.describe}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">{item.value}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Total Followers</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{trader.totalFollowers}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Win Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{trader.averageWinRate}%</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Total Trades</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{trader.tradeCount}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Trading Days</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{trader.tradeDays}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Daily Profit Rate</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trader.dailyProfitRateList}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="cTime" tickFormatter={formatDate} />
                            <YAxis />
                            <Tooltip labelFormatter={formatDate} />
                            <Line type="monotone" dataKey="rate" stroke="#8884d8" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card> */}

                    <div>
                      <h2 className="mb-2 text-2xl font-bold">Asset allocation</h2>
                      <div className="flex flex-wrap gap-2">
                        {trader.currentTradingList.map((item, index) => (
                          <Badge key={index} variant="outline">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="orders">
                  <Tabs defaultValue="history" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="current" onClick={getActiveOrders}>Active trades</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="history" className="space-y-4">
                      {bitgetHistoryOrder===undefined ? (
                        <div>
                          <TableSkeleton />
                        </div>
                      ) : (
                        <>
                          <DataTable data={bitgetHistoryOrder} columns={orderColumns} />
                        </>
                      )}
                    </TabsContent>
                    <TabsContent value="current" className="space-y-4">
                      {isCurrentOrderLoading ? (
                        <div>
                          <TableSkeleton />
                        </div>
                      ) : (
                        <>
                          <DataTable data={bitgetCurrentOrder} columns={bitgetCurrentOrderColumns} />
                        </>
                      )}
                    </TabsContent>
                  </Tabs>

                </TabPanel>
              </Tabs2>

              </>
            )}

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
