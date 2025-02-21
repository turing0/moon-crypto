"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import ArbitrageConfigForm from "@/components/arbitrage/arbitrage-config-form"
import { symbol } from "prop-types"

type ExchangeData = {
  name: string
  logo: string
  rate: string
}

type FundingRate = {
  symbol: string
  symbolLogo: string
  exchanges: ExchangeData[]
}

const mockFundingRates: FundingRate[] = [
  {
    symbol: "BTC",
    symbolLogo: "/btc-logo.svg",
    exchanges: [
      {
        name: "Binance",
        logo: "",
        rate: "-0.0016%",
      },
      {
        name: "OKX",
        logo: "",
        rate: "-0.0044%",
      },
      {
        name: "Bybit",
        logo: "",
        rate: "0.0007%",
      },
      {
        name: "Bitget",
        logo: "",
        rate: "-0.0026%",
      },
    ],
  },
]

export default function FundingPage({ params }: { params: { symbol: string } }) {
  const [fundingRates, setFundingRates] = useState<FundingRate[]>(mockFundingRates)

  useEffect(() => {
    // Simulating an API call
    const fetchFundingRates = async () => {
      // Replace this with actual API call in production
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setFundingRates(mockFundingRates)
    }

    fetchFundingRates()
  }, [])

  const getRateColor = (rate: string) => {
    const value = Number.parseFloat(rate)
    return value < 0 ? "text-green-500" : value > 0 ? "text-red-500" : "text-gray-500"
  }

  return (
    <div className="flex flex-col space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Funding Rates</h1>
        <Button>
          <Link href="/arbitrage">Back to Arbitrage</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[100px]">Symbol</TableHead>
              {fundingRates[0]?.exchanges.map((exchange) => (
                <TableHead key={exchange.name} className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className="relative size-5">
                      <Image
                        src={exchange.logo || "/placeholder.svg"}
                        alt={``}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    {exchange.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {fundingRates.map((rate) => (
              <TableRow key={rate.symbol}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="relative size-5">
                      <Image
                        src={rate.symbolLogo || "/placeholder.svg"}
                        alt={``}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    {rate.symbol}
                  </div>
                </TableCell>
                {rate.exchanges.map((exchange) => (
                  <TableCell key={exchange.name} className={getRateColor(exchange.rate)}>
                    {exchange.rate}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ArbitrageConfigForm symbol={params.symbol} />
    </div>
  )
}

