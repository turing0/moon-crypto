"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ArbitrageConfigForm from "@/components/arbitrage/arbitrage-config-form"
import { getBinanceRate } from "@/actions/arbitrage"
import { toast } from "sonner"

interface FundingRates {
  // [exchangeName: string]: number | string;
  [exchangeName: string]: {
    fundingRate: number | string
    disabled: boolean
  };

}

export default function FundingPage({ params }: { params: { symbol: string } }) {
  const [fundingRates, setFundingRates] = useState<FundingRates>({})

  useEffect(() => {
    async function getFundingRate() {
      try {
        const { fundingRate, error } = await getBinanceRate(params.symbol)
        console.log(fundingRate)
        if (error) {
          toast.error("资金费率获取失败", {
            description:error,
          });
          console.error("Failed to getFundingRate:", error)
        } else {
          setFundingRates(fundingRate)
        }
      } catch (error) {
        console.error("Failed to getFundingRate:", error)
      }
    }

    getFundingRate()
  }, [])

  const getRateColor = (rate: number | string) => {
    // const value = Number.parseFloat(rate)
    // return value < 0 ? "text-green-500" : value > 0 ? "text-red-500" : "text-gray-500"
    if (typeof rate === 'number') {
      if (rate > 0) return "text-green-500";
      if (rate < 0) return "text-red-500";
        return "";
    } else if (typeof rate === 'string') {
        const numRate = parseFloat(rate); // Try to parse if it's a string representation of a number
        if (!isNaN(numRate)) {
            if (numRate > 0) return "text-green-500";
            if (numRate < 0) return "text-red-500";
            return "";
        }
        return ""; // Handle cases where string rate is not a number if needed
    }
    return ""; // Default case
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
              {Object.keys(fundingRates)?.map((exchange) => (
                <TableHead key={exchange} className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    {/* <div className="relative size-5">
                      <Image
                        src={exchange.logo || "/placeholder.svg"}
                        alt={``}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div> */}
                    {exchange}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {/* <div className="relative size-5">
                      <Image
                        src={rate.symbolLogo || "/placeholder.svg"}
                        alt={``}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                    </div> */}
                    {params.symbol}
                  </div>
                </TableCell>
                {Object.entries(fundingRates).map(([exchange, rate]) => (
                  <TableCell key={exchange} className={getRateColor(rate?.fundingRate)}>
                    {/* {rate?.fundingRate && (typeof rate?.fundingRate === 'string' ?
                      parseFloat(rate?.fundingRate).toFixed(4) :
                      rate?.fundingRate.toFixed(4))} */}
                    {rate?.disabled ? (
                        "/"
                    ):(
                      <>
                        {rate?.fundingRate && (typeof rate?.fundingRate === 'string' ?
                        (parseFloat(rate?.fundingRate) * 100).toFixed(4) :
                        (rate?.fundingRate * 100).toFixed(4))}
                        {rate?.fundingRate ? "%":"" }
                      </>
                    )}
                  </TableCell>
                ))}
              </TableRow>
          </TableBody>
        </Table>
      </div>

      <ArbitrageConfigForm symbol={params.symbol} fundingRates={fundingRates} />

    </div>
  )
}

