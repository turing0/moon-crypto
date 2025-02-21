"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  longExchange: z.string().min(1, "请选择做多交易所"),
  longApiAccount: z.string().min(1, "请选择做多API账号"),
  shortExchange: z.string().min(1, "请选择做空交易所"),
  shortApiAccount: z.string().min(1, "请选择做空API账号"),
  longType: z.enum(["spot", "futures"], {
    required_error: "请选择做多类型",
  }),
  shortType: z.enum(["spot", "futures"], {
    required_error: "请选择做空类型",
  }),
  amount: z.string().min(1, "请输入投资金额"),
  leverage: z.string().min(1, "请输入杠杆倍数"),
  closeCondition: z.enum(["directionChange", "rateThreshold"]),
  closeOnRate: z.string().optional(),
})

type ArbitrageConfig = z.infer<typeof formSchema>

const exchanges = [
  { value: "binance", label: "Binance" },
  { value: "okx", label: "OKX" },
  { value: "bybit", label: "Bybit" },
  { value: "bitget", label: "Bitget" },
]

const apiAccounts = [
  { value: "account1", label: "Account 1" },
  { value: "account2", label: "Account 2" },
  { value: "account3", label: "Account 3" },
]
interface ArbitrageConfigFormProps {
  symbol: string;
}

export default function ArbitrageConfigForm({ symbol }: ArbitrageConfigFormProps) {
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
    console.log("配置提交:", data)
    // TODO: 实现套利策略启动逻辑
  }

  const closeCondition = form.watch("closeCondition")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{symbol} 套利配置</CardTitle>
        <CardDescription>设置套利策略参数，包括交易所选择、投资金额和平仓条件</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 做多配置 */}
              <div className="space-y-4">
                <h3 className="font-medium">做多配置</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="longExchange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>做多交易所</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择交易所" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exchanges.map((exchange) => (
                              <SelectItem key={exchange.value} value={exchange.value}>
                                {exchange.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longApiAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API账号</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择API账号" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {apiAccounts.map((account) => (
                              <SelectItem key={account.value} value={account.value}>
                                {account.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              <div className="space-y-4">
                <h3 className="font-medium">做空配置</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shortExchange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>做空交易所</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择交易所" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exchanges.map((exchange) => (
                              <SelectItem key={exchange.value} value={exchange.value}>
                                {exchange.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortApiAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API账号</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="选择API账号" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {apiAccounts.map((account) => (
                              <SelectItem key={account.value} value={account.value}>
                                {account.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
            <div className="space-y-4">
              <h3 className="font-medium">投资配置</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>投资金额 (USDT)</FormLabel>
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
              <h3 className="font-medium">平仓条件</h3>
              <FormField
                control={form.control}
                name="closeCondition"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>选择平仓条件</FormLabel>
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

