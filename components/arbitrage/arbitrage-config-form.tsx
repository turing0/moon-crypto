"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { createArbitrageConfig } from "@/actions/arbitrage"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Icons } from "../shared/icons"

interface ApiAccount {
  id: string
  accountName: string
  exchangeName: string
}

interface GroupedApiAccounts {
  [key: string]: ApiAccount[]
}

const formSchema = z.object({
  longApiAccountId: z.string().min(1, "请选择做多API账号"),
  shortApiAccountId: z.string().min(1, "请选择做空API账号"),
  longType: z.enum(["spot", "futures"], {
    required_error: "请选择做多类型",
  }),
  shortType: z.enum(["spot", "futures"], {
    required_error: "请选择做空类型",
  }),
  amount: z.string().min(1, "请输入单边投资金额"),
  leverage: z.string().min(1, "请输入杠杆倍数"),
  closeCondition: z.enum(["directionChange", "rateThreshold"]),
  closeOnRate: z.string().optional(),
})

type ArbitrageConfig = z.infer<typeof formSchema>

interface ArbitrageConfigFormProps {
  symbol: string
  fundingRates: Record<string, any>
}

export default function ArbitrageConfigForm({ symbol, fundingRates }: ArbitrageConfigFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [userApi, setUserApi] = useState<GroupedApiAccounts>({})
  const [isCreatePending, startCreateTransition] = useTransition()

  useEffect(() => {
    if (!session?.user?.id) {
      return
    }
    if (Object.keys(userApi).length>0) {
      return
    }
    async function fetchUserApiData() {
      try {
        const response = await fetch("/api/userApi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session?.user.id }),
        })
        if (response.ok) {
          const data = await response.json()
          const groupedData = data.reduce((acc: GroupedApiAccounts, item: ApiAccount) => {
            if (!acc[item.exchangeName]) {
              acc[item.exchangeName] = []
            }
            acc[item.exchangeName].push(item)
            return acc
          }, {})
          setUserApi(groupedData)
        } else {
          console.error("Failed to fetch user data:", response.status)
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUserApiData()
  }, [session])

  const form = useForm<ArbitrageConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      longType: "futures",
      shortType: "futures",
      amount: "10000",
      leverage: "1",
      closeCondition: "directionChange",
      closeOnRate: "0.01",
    },
  })

  const [openingFees, setOpeningFees] = useState(0)
  const [profit, setProfit] = useState(0)

  const closeCondition = form.watch("closeCondition")
  const amount = form.watch("amount")
  const leverage = form.watch("leverage")
  const longType = form.watch("longType")
  const shortType = form.watch("shortType")
  const longApiAccountId = form.watch("longApiAccountId")
  const shortApiAccountId = form.watch("shortApiAccountId")

  useEffect(() => {
    if (amount && leverage && longType && shortType) {
      const amountNum = Number.parseFloat(amount)
      const leverageNum = Number.parseFloat(leverage)
      // binance bybit bitget okx
      // 杠杆 0.1% 合约 0.02%
      const fees =
        amountNum *
        leverageNum *
        ((longType === "futures" ? 0.0002 : 0.001) + (shortType === "futures" ? 0.0002 : 0.001))
      setOpeningFees(fees)

      // TODO: 资金费率获取 4h 转换
      let longFundingRate = 0
      let shortFundingRate = 0
      if (longType === "futures") {
        const selectedLongExchange = Object.entries(userApi).find(([_, apis]) =>
          apis.some((api) => api.id === longApiAccountId),
        )
        if (selectedLongExchange) {
          const [exchangeName] = selectedLongExchange
          longFundingRate = fundingRates[exchangeName]?.fundingRate
        }
      }
      if (shortType === "futures") {
        const selectedShortExchange = Object.entries(userApi).find(([_, apis]) =>
          apis.some((api) => api.id === shortApiAccountId),
        )
        if (selectedShortExchange) {
          const [exchangeName] = selectedShortExchange
          shortFundingRate = fundingRates[exchangeName]?.fundingRate
        }
      }
      const projectedProfit =
        amountNum *
        leverageNum *
        ((longType === "spot" ? 0 : -longFundingRate) + (shortType === "spot" ? 0 : shortFundingRate))
      setProfit(projectedProfit)
    }
  }, [amount, leverage, longType, shortType, longApiAccountId, shortApiAccountId, fundingRates, userApi])

  useEffect(() => {
    // Only run this logic when we have both user API accounts and funding rates
    if (Object.keys(userApi).length > 0 && Object.keys(fundingRates).length > 0) {
      // Filter exchanges that the user has accounts for
      const userExchanges = Object.keys(userApi)
      const availableExchanges = userExchanges.filter(
        (exchange) => fundingRates[exchange] && !fundingRates[exchange]?.disabled,
      )

      if (availableExchanges.length >= 2) {
        // Sort exchanges by funding rate
        const sortedExchanges = [...availableExchanges].sort(
          (a, b) => fundingRates[a].fundingRate - fundingRates[b].fundingRate,
        )

        // Get exchange with lowest funding rate for long position
        const longExchange = sortedExchanges[0]
        // Get exchange with highest funding rate for short position
        const shortExchange = sortedExchanges[sortedExchanges.length - 1]

        // Set the first available API account from each exchange
        if (userApi[longExchange]?.length > 0) {
          form.setValue("longApiAccountId", userApi[longExchange][0].id)
        }

        if (userApi[shortExchange]?.length > 0) {
          form.setValue("shortApiAccountId", userApi[shortExchange][0].id)
        }
      }
    }
  }, [userApi, fundingRates, form])

  const onSubmit = (data: ArbitrageConfig) => {
    startCreateTransition(async () => {
      let longFundingRate = 0
      let shortFundingRate = 0
      const allFutures = longType === "futures" && shortType === "futures"
      if (longType === "futures") {
        const selectedLongExchange = Object.entries(userApi).find(([_, apis]) =>
          apis.some((api) => api.id === longApiAccountId),
        )
        if (selectedLongExchange) {
          const [exchangeName] = selectedLongExchange
          longFundingRate = fundingRates[exchangeName].fundingRate
        }
      }
      if (shortType === "futures") {
        const selectedShortExchange = Object.entries(userApi).find(([_, apis]) =>
          apis.some((api) => api.id === shortApiAccountId),
        )
        if (selectedShortExchange) {
          const [exchangeName] = selectedShortExchange
          shortFundingRate = fundingRates[exchangeName].fundingRate
        }
      }

      const { error } = await createArbitrageConfig(
        symbol,
        allFutures
          ? Math.abs(longFundingRate - shortFundingRate)
          : shortType === "futures"
            ? shortFundingRate
            : longFundingRate,
        data,
      )

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      toast.success("Arbitrage added")
      router.push("/arbitrage/manage")
    })
    console.log("配置提交:", data)
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl">{symbol} 资金费率套利配置</CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 交易配置部分 */}
            <div className="space-y-4">
              {/* <h3 className="text-base font-medium">交易配置</h3> */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 做多配置 */}
                <div className="space-y-3 rounded-md border-l-4 border-green-500 py-3 pl-3 pr-1">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="size-4 text-green-500" />
                    <h4 className="text-sm font-medium text-green-700 dark:text-green-400">做多配置</h4>
                  </div>
                  <FormField
                    control={form.control}
                    name="longApiAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>做多API账号</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-green-200 focus:ring-green-500/20">
                              <SelectValue placeholder="Select API" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(userApi).length === 0 ? (
                              <div className="flex flex-col items-center gap-3 p-4 text-center">
                                <div className="rounded-full bg-amber-100 p-2.5 dark:bg-amber-900">
                                  <Icons.warning className="size-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-amber-800 dark:text-amber-300">No available API</p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Please add an exchange API account.
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950"
                                >
                                  <Link href="/exchanges" className="flex items-center gap-1.5">
                                    <span>Go to add API account</span>
                                    <Icons.arrowRight className="size-3.5" />
                                  </Link>
                                </Button>
                              </div>
                            ) : (
                              Object.entries(userApi).map(([exchangeName, apis]) => (
                                <SelectGroup key={exchangeName}>
                                  <SelectLabel className="px-2 py-1.5 text-sm font-bold text-primary">
                                    {exchangeName}
                                  </SelectLabel>
                                  {apis.map((api) => (
                                    <SelectItem
                                      key={api.id}
                                      value={api.id}
                                      disabled={fundingRates[exchangeName]?.disabled}
                                    >
                                      {api.accountName}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>做多类型</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-green-200 focus:ring-green-500/20">
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="spot">现货</SelectItem>
                            <SelectItem value="futures">合约</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 做空配置 */}
                <div className="space-y-3 rounded-md border-l-4 border-red-500 py-3 pl-3 pr-1">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="size-4 text-red-500" />
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400">做空配置</h4>
                  </div>
                  <FormField
                    control={form.control}
                    name="shortApiAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>做空API账号</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-red-200 focus:ring-red-500/20">
                              <SelectValue placeholder="Select API" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(userApi).length === 0 ? (
                              <div className="flex flex-col items-center gap-3 p-4 text-center">
                                <div className="rounded-full bg-amber-100 p-2.5 dark:bg-amber-900">
                                  <Icons.warning className="size-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-amber-800 dark:text-amber-300">No available API</p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    Please add an exchange API account.
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-1 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950"
                                >
                                  <Link href="/exchanges" className="flex items-center gap-1.5">
                                    <span>Go to add API account</span>
                                    <Icons.arrowRight className="size-3.5" />
                                  </Link>
                                </Button>
                              </div>
                            ) : (
                              Object.entries(userApi).map(([exchangeName, apis]) => (
                                <SelectGroup key={exchangeName}>
                                  <SelectLabel className="px-2 py-1.5 text-sm font-bold text-primary">
                                    {exchangeName}
                                  </SelectLabel>
                                  {apis.map((api) => (
                                    <SelectItem
                                      key={api.id}
                                      value={api.id}
                                      disabled={fundingRates[exchangeName]?.disabled}
                                    >
                                      {api.accountName}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>做空类型</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-red-200 focus:ring-red-500/20">
                              <SelectValue placeholder="选择类型" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="spot">现货</SelectItem>
                            <SelectItem value="futures">合约</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* 投资配置 */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">投资配置</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>单边投资金额 (USDT)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>杠杆倍数</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 平仓条件 */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">平仓条件</h3>

              <div>
                <FormField
                  control={form.control}
                  name="closeCondition"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="directionChange" />
                            </FormControl>
                            <FormLabel className="font-normal">资金费率方向反转时平仓</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rateThreshold" />
                            </FormControl>
                            <FormLabel className="font-normal">资金费率差值小于阈值时平仓</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {closeCondition === "rateThreshold" && (
                  <div className="ml-7 mt-4">
                    <FormField
                      control={form.control}
                      name="closeOnRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>资金费率阈值 (%)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.001" className="max-w-[200px]" {...field} />
                          </FormControl>
                          <FormDescription>当资金费率差值小于此阈值时平仓</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 预计收益 */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">预计收益</h3>

              <div className="rounded-md border bg-muted/20 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">预计开仓手续费</div>
                    <div className="text-lg font-medium">{openingFees.toFixed(2)} USDT</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">当前资金费率预计4小时收益</div>
                    <div className={`text-lg font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {profit.toFixed(2)} USDT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isCreatePending}>
              {isCreatePending && <Icons.spinner className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              启动套利策略
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

