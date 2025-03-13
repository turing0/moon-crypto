"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ArbitrageConfigForm from "@/components/arbitrage/arbitrage-config-form"
import { getFundingRate } from "@/actions/arbitrage"
import { toast } from "sonner"
import { Icons } from "@/components/shared/icons"

interface FundingRates {
  // [exchangeName: string]: number | string;
  [exchangeName: string]: {
    fundingRate: number | string
    fundingTimestamp: number
    interval: string | null
    disabled: boolean
  };
}

const formatCountdown = (timestamp: number) => {
  const now = Date.now()
  const diff = timestamp - now
  if (diff <= 0) return "Now"

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export default function FundingPage({ params }: { params: { symbol: string } }) {
  const [fundingRates, setFundingRates] = useState<FundingRates>({})
  const symbol = params.symbol.toUpperCase()

  useEffect(() => {
    async function getRate() {
      try {
        const { fundingRate, error } = await getFundingRate(symbol)
        console.log('fundingRate', fundingRate)
        if (error) {
          toast.error("Failed to getFundingRate", {
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

    getRate()
  }, [params.symbol])

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

  const [countdown, setCountdown] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const timer = setInterval(() => {
      const newCountdown: { [key: string]: string } = {}
      Object.entries(fundingRates).forEach(([exchange, rate]) => {
        if (!rate.disabled && rate.fundingTimestamp) {
          newCountdown[exchange] = formatCountdown(rate.fundingTimestamp)
        }
      })
      setCountdown(newCountdown)
    }, 1000)

    return () => clearInterval(timer)
  }, [fundingRates])

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/arbitrage" className="inline-flex cursor-pointer items-center">
          <Icons.arrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Funding Rates</h1>
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
                  <TableCell key={exchange}>
                    <div className={getRateColor(rate?.fundingRate)}>
                      {rate?.disabled ? (
                        "/"
                      ) : (
                        <>
                          {rate?.fundingRate &&
                            (typeof rate?.fundingRate === "string"
                              ? (Number.parseFloat(rate?.fundingRate) * 100).toFixed(4)
                              : (rate?.fundingRate * 100).toFixed(4))}
                          {rate?.fundingRate ? "%" : ""}
                        </>
                      )}
                    </div>
                    {!rate?.disabled && (
                      <>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Next: {countdown[exchange] || "Loading..."}
                        </div>
                        <div className="text-xs text-muted-foreground">Interval: {rate.interval}</div>
                      </>
                    )}
                  </TableCell>
                ))}
              </TableRow>
          </TableBody>
        </Table>
      </div>

      <ArbitrageConfigForm symbol={symbol} fundingRates={fundingRates} />
      

      <div>

      </div>

    </div>
  )
}

