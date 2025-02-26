"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/header"
import { getArbitrageConfig } from "@/actions/arbitrage"
import { useSession } from "next-auth/react"
import { PackageSearch, AlertCircle } from "lucide-react"
import { Icons } from "@/components/shared/icons"

interface ArbitrageConfig {
  id: string
  symbol: string
  longType: string
  shortType: string
  amount: number
  leverage: number
  initialFundingRate: number
  closeCondition: string
  closeOnRate: number | null
  status: string
  createdAt: Date
  updatedAt: Date
  longOrderId: string | null
  shortOrderId: string | null
  closeLongOrderId?: string | null
  closeShortOrderId?: string | null
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "ended":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }
}

const OrderStatus = ({ type, orderId }: { type: "long" | "short"; orderId: string | null; }) => {
  if (orderId?.startsWith('Error')) {
    return (
      <div className="rounded-md bg-destructive/10 p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="mt-0.5 size-5 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">{type === "long" ? "做多" : "做空"}订单错误</p>
            <p className="text-sm text-destructive/90">{orderId}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">{type === "long" ? "做多" : "做空"}仓位</p>
        <Badge variant="outline" className={orderId ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}>
          {orderId ? "已成交" : "等待成交"}
        </Badge>
      </div>
      {orderId && (
        <p className="truncate font-mono text-sm text-muted-foreground">
          订单ID: {orderId}
        </p>
      )}
    </div>
  )
}

export default function ArbitrageManagementPage() {
  const { data: session } = useSession()
  const [arbitrageConfigs, setArbitrageConfigs] = useState<ArbitrageConfig[] | undefined>(undefined)

  useEffect(() => {
    if (!session) return

    async function fetchArbitrageConfigs() {
      const configs = await getArbitrageConfig(session?.user.id!)
      setArbitrageConfigs(configs)
    }

    fetchArbitrageConfigs()
  }, [session])

  const handleLimitClose = async (id: string) => {
    try {
      await fetch(`/api/arbitrage/${id}/limit-close`, { method: "POST" })
      toast.success("限价平仓指令已发送")
    } catch (error) {
      toast.error("限价平仓失败")
    }
  }

  const handleMarketClose = async (id: string) => {
    try {
      await fetch(`/api/arbitrage/${id}/market-close`, { method: "POST" })
      toast.success("市价平仓指令已发送")
    } catch (error) {
      toast.error("市价平仓失败")
    }
  }

  const handleCancelArbitrage = async (id: string) => {
    try {
      await fetch(`/api/arbitrage/${id}/cancel`, { method: "POST" })
      toast.success("套利已取消")
      // Refresh the configs after cancellation
      const updatedConfigs = await getArbitrageConfig(session?.user.id!)
      setArbitrageConfigs(updatedConfigs)
    } catch (error) {
      toast.error("取消套利失败")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader heading="套利管理" />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {arbitrageConfigs === undefined ? (
          <div className="col-span-full flex h-40 items-center justify-center">
            <Icons.spinner className="size-8 animate-spin text-gray-500" />
          </div>
        ) : arbitrageConfigs.length === 0 ? (
          <Card className="col-span-full">
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <PackageSearch className="size-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">暂无套利配置</h3>
              <p className="max-w-sm text-muted-foreground">
                当前没有任何套利配置。您可以创建新的套利配置来开始交易。
              </p>
            </div>
          </Card>
        ) : (
          arbitrageConfigs.map((config) => (
            <Card key={config.id} className="transition-shadow duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl font-bold">{config.symbol}</CardTitle>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        {config.leverage}x
                      </Badge>
                    </div>
                    <Badge className={`${getStatusColor(config.status)}`}>{config.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">做多类型</p>
                      <p className="font-medium">{config.longType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">做空类型</p>
                      <p className="font-medium">{config.shortType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">单边投资金额</p>
                      <p className="font-medium">{config.amount} USDT</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">平仓条件</p>
                    <p className="font-medium">{config.closeCondition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">创建时间</p>
                    <p className="font-medium">{new Date(config.createdAt).toLocaleString()}</p>
                  </div>
                  
                  {/* Order Status Section */}
                  <div className="space-y-3 rounded-lg bg-muted/50 p-3">
                    <OrderStatus 
                      type="long"
                      orderId={config.longOrderId}
                    />
                    <OrderStatus 
                      type="short"
                      orderId={config.shortOrderId}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {config.longOrderId && config.shortOrderId ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handleMarketClose(config.id)}>
                      市价全平
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleLimitClose(config.id)}>
                      限价全平
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => handleCancelArbitrage(config.id)}>
                    取消套利
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}