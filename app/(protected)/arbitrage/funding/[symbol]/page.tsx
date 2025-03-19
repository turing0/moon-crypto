"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import ArbitrageConfigForm from "@/components/arbitrage/arbitrage-config-form"
import { getFundingRate } from "@/actions/arbitrage"
import { toast } from "sonner"
import { Icons } from "@/components/shared/icons"
import { Search } from "lucide-react"
import ccxt, { type Exchange } from "ccxt"

interface FundingRates {
  [exchangeName: string]: {
    fundingRate: number | string
    fundingTimestamp: number
    interval: string | null
    disabled: boolean
  }
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

const exchangeIds = ["binance", "bitget", "bybit", "okx"]

export default function FundingPage({ params }: { params: { symbol: string } }) {
  const [fundingRates, setFundingRates] = useState<FundingRates>({})
  const [searchSymbol, setSearchSymbol] = useState("")
  const symbol = params.symbol.toUpperCase()
  const router = useRouter()
  const [exchanges, setExchanges] = useState<Record<string, Exchange>>({})
  const [currentSymbol, setCurrentSymbol] = useState(params.symbol.toUpperCase())

  useEffect(() => {
    console.log("starting exchanges...")
    const newExchanges: Record<string, Exchange> = exchangeIds.reduce((acc: any, exchangeId) => {
      acc[exchangeId] = new (ccxt.pro as any)[exchangeId]()
      return acc
    }, {})
    setExchanges(newExchanges)
  }, [])

  async function getRate() {
    const startTime = performance.now()
    try {
      const { fundingRate, error } = await getFundingRate(currentSymbol)
      console.log("fundingRate", fundingRate)
      if (error) {
        toast.error("Failed to getFundingRate", {
          description: error,
        })
        console.error("Failed to getFundingRate:", error)
      } else {
        setFundingRates(fundingRate)
      }
    } catch (error) {
      console.error("Failed to getFundingRate:", error)
    } finally {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.log(`getRate executed in ${duration}ms`)
    }
  }

  useEffect(() => {
    document.title = `${currentSymbol}`
    const fetchFundingRates = async () => {
      const startTime = performance.now()

      if (Object.keys(exchanges).length === 0) {
        console.log("Exchanges are not yet initialized")
        return
      }

      try {
        const fetchPromises = exchangeIds.map(async (exchangeId) => {
          const exchange = exchanges[exchangeId]
          if (!exchange) {
            console.log(`Exchange ${exchangeId} is not available`)
            return {
              exchangeId,
              fundingRate: {
                fundingRate: "N/A",
                fundingTimestamp: Date.now(),
                interval: null,
                disabled: true,
              },
            }
          }

          try {
            const fundingRate = await exchange.fetchFundingRate(`${currentSymbol}/USDT:USDT`) // Use currentSymbol instead
            return {
              exchangeId,
              fundingRate: {
                fundingRate: fundingRate.fundingRate ?? 0,
                fundingTimestamp: fundingRate.timestamp ?? Date.now(),
                interval: fundingRate.interval ?? null,
                disabled: false,
              },
            }
          } catch (e) {
            console.log(e)
            return {
              exchangeId,
              fundingRate: {
                fundingRate: "N/A",
                fundingTimestamp: Date.now(),
                interval: null,
                disabled: true,
              },
            }
          }
        })

        const results = await Promise.all(fetchPromises)

        const newFundingRates: FundingRates = {}
        results.forEach(({ exchangeId, fundingRate }) => {
          newFundingRates[exchangeId] = fundingRate
        })
        console.log("newFundingRates", newFundingRates)
        setFundingRates(newFundingRates)
      } catch (e) {
        console.log("Error in fetching funding rates: " + JSON.stringify(e))
      }

      const endTime = performance.now()
      console.log(endTime - startTime)
    }

    // Set the interval to fetch the rate every 2 seconds
    // const rateInterval = setInterval(() => {
    //   getRate()
    // }, 2000)
    // // Cleanup interval on component unmount
    // return () => clearInterval(rateInterval)

    fetchFundingRates()
    getRate()
  }, [exchanges, currentSymbol])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // console.log("User has left the page");
        // Handle user leaving the page (e.g., pause a video, stop a timer, etc.)
      } else {
        // console.log("User has returned to the page");
        getRate()
      }
    }

    // Attach the visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Clean up the listener when the component unmounts
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const getRateColor = (rate: number | string) => {
    if (typeof rate === "number") {
      if (rate > 0) return "text-green-500"
      if (rate < 0) return "text-red-500"
      return ""
    } else if (typeof rate === "string") {
      const numRate = Number.parseFloat(rate)
      if (!isNaN(numRate)) {
        if (numRate > 0) return "text-green-500"
        if (numRate < 0) return "text-red-500"
        return ""
      }
      return ""
    }
    return ""
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

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchSymbol.trim()) {
      // Update URL without full navigation
      window.history.pushState({}, "", `/arbitrage/funding/${searchSymbol.trim().toUpperCase()}`)
      // Update the symbol state directly
      setCurrentSymbol(searchSymbol.trim().toUpperCase())
      // Update document title
      document.title = searchSymbol.trim().toUpperCase()
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/arbitrage" className="inline-flex cursor-pointer items-center">
          <Icons.arrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">Funding Rates</h1>
      </div>

      {/* Symbol Search Component */}
      <div className="w-full max-w-md">
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="e.g. BTC"
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Search className="mr-2 size-4" />
            Search
          </Button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[100px]">Symbol</TableHead>
              {Object.keys(fundingRates)?.map((exchange) => (
                <TableHead key={exchange} className="min-w-[120px]">
                  <div className="flex items-center gap-2">{exchange}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">{currentSymbol}</div>
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

      <ArbitrageConfigForm symbol={currentSymbol} fundingRates={fundingRates} />

      <div></div>
    </div>
  )
}

