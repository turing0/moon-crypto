"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/table/data-table"
import ArbitrageForm from "@/components/arbitrage/arbitrage-form"

export default function ArbitragePage() {

  const allTradesColumns = [
    { accessorKey: "pair", header: "交易对" },
    { accessorKey: "exchange", header: "交易所" },
    { accessorKey: "price", header: "价格" },
    { accessorKey: "volume", header: "成交量" },
    { accessorKey: "profit", header: "利润" },
  ]

  const newCoinTradesColumns = [
    { accessorKey: "pair", header: "交易对" },
    { accessorKey: "exchange", header: "交易所" },
    { accessorKey: "listingDate", header: "上市日期" },
    { accessorKey: "price", header: "价格" },
    { accessorKey: "volume", header: "成交量" },
  ]

  const allTradesData = [
    { pair: "BTC/USDT", exchange: "Binance", price: "30,000", volume: "1.5", profit: "2.5%" },
    { pair: "ETH/USDT", exchange: "Coinbase", price: "2,000", volume: "10", profit: "1.8%" },
  ]

  const newCoinTradesData = [
    { pair: "NEW/USDT", exchange: "Binance", listingDate: "2023-06-01", price: "0.1", volume: "1,000,000" },
    { pair: "FRESH/USDT", exchange: "Kucoin", listingDate: "2023-06-02", price: "0.05", volume: "500,000" },
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        {/* <DashboardHeader
          heading="套利交易"
        /> */}
      </div>
      <div className="container mx-auto">

        <div className="mb-8">
          <ArbitrageForm />
        </div>

        <Tabs defaultValue="all-trades" className="w-full">
          <TabsList className="">
            <TabsTrigger value="all-trades">全部交易</TabsTrigger>
            <TabsTrigger value="new-coin-trades">新币交易</TabsTrigger>
          </TabsList>
          <TabsContent value="all-trades">
            <DataTable columns={allTradesColumns} data={allTradesData} />
          </TabsContent>
          <TabsContent value="new-coin-trades">
            <DataTable columns={newCoinTradesColumns} data={newCoinTradesData} />
          </TabsContent>
        </Tabs>

      </div>
    </>
  )
}

