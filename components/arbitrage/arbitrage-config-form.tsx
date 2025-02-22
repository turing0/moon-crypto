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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { createArbitrageConfig } from "@/actions/arbitrage"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
}

export default function ArbitrageConfigForm({ symbol }: ArbitrageConfigFormProps) {
  const { data: session } = useSession()
  const router = useRouter();
  const [userApi, setUserApi] = useState<GroupedApiAccounts>({})
  const [isCreatePending, startCreateTransition] = useTransition()

  useEffect(() => {
    if (!session?.user?.id) {
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
          // console.log("userApi groupedData:", groupedData)
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
      longType: "spot",
      shortType: "futures",
      amount: "1000",
      leverage: "1",
      closeCondition: "directionChange",
      closeOnRate: "0.01",
    },
  })

  const onSubmit = (data: ArbitrageConfig) => {
    startCreateTransition(async () => {
      // TODO: initialFundingRate
      const { error } = await createArbitrageConfig(symbol, 0.5, data)

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      toast.success("Arbitrage added")
      router.push('/arbitrage/manage')
    })
    console.log("配置提交:", data)

    // TODO: 实现套利策略启动逻辑
  }

  const closeCondition = form.watch("closeCondition")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{symbol} 资金费率套利配置</CardTitle>
        <CardDescription>设置资金费率套利策略参数，包括API账号选择、单边投资金额和平仓条件</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 做多配置 */}
              <div className="space-y-2">
                <h3 className="font-medium">做多配置</h3>
                <FormField
                  control={form.control}
                  name="longApiAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>做多API账号</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择API账号" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(userApi).length === 0 ? (
                            <div className="rounded-md px-4 py-2 text-center font-semibold text-amber-500">
                              尚未添加API账号。请前往 <Link href="/exchanges" className="text-amber-500 underline">Exchanges 页面</Link> 添加。
                            </div>
                          ) : (
                            Object.entries(userApi).map(([exchangeName, apis]) => (
                              <SelectGroup key={exchangeName}>
                                <SelectLabel className="px-2 py-1.5 text-sm font-bold text-primary">
                                  {exchangeName}
                                </SelectLabel>
                                {apis.map((api) => (
                                  <SelectItem key={api.id} value={api.id}>
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
                          <SelectTrigger>
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
              <div className="space-y-2">
                <h3 className="font-medium">做空配置</h3>
                <FormField
                  control={form.control}
                  name="shortApiAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>做空API账号</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择API账号" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(userApi).length === 0 ? (
                            <div className="rounded-md px-4 py-2 text-center font-semibold text-amber-500">
                              尚未添加API账号。请前往 <Link href="/exchanges" className="text-amber-500 underline">Exchanges 页面</Link> 添加。
                            </div>
                          ) : (Object.entries(userApi).map(([exchangeName, apis]) => (
                            <SelectGroup key={exchangeName}>
                              <SelectLabel className="px-2 py-1.5 text-sm font-bold text-primary">
                                {exchangeName}
                              </SelectLabel>
                              {apis.map((api) => (
                                <SelectItem key={api.id} value={api.id}>
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
                          <SelectTrigger>
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

            {/* 投资配置 */}
            <div className="space-y-2">
              <h3 className="font-medium">投资配置</h3>
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
            <div className="space-y-2">
              <h3 className="font-medium">平仓条件</h3>
              <FormField
                control={form.control}
                name="closeCondition"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    {/* <FormLabel>选择平仓条件</FormLabel> */}
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
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
                <FormField
                  control={form.control}
                  name="closeOnRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>资金费率阈值 (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" {...field} />
                      </FormControl>
                      <FormDescription>当资金费率差值小于此阈值时平仓</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Button type="submit" className="w-full">
              启动套利策略
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

