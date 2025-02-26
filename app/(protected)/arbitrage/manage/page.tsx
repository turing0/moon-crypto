"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/header"
import { getArbitrageConfig } from "@/actions/arbitrage"
import { useSession } from "next-auth/react"

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

export default function ArbitrageManagementPage() {
  const { data: session } = useSession()
  const [arbitrageConfigs, setArbitrageConfigs] = useState<ArbitrageConfig[]>([])

  useEffect(() => {
    if (!session) return

    async function fetchArbitrageConfigs() {
      const response = await getArbitrageConfig(session?.user.id!)
      setArbitrageConfigs(response)
    }

    fetchArbitrageConfigs()
  }, [session])

  const handleLimitClose = async (id: string) => {
    try {
      await fetch(`/api/arbitrage-configs/${id}/limit-close`, { method: "POST" })
      toast.success("限价平仓指令已发送")
    } catch (error) {
      toast.error("限价平仓失败")
    }
  }

  const handleMarketClose = async (id: string) => {
    try {
      await fetch(`/api/arbitrage-configs/${id}/market-close`, { method: "POST" })
      toast.success("市价平仓指令已发送")
    } catch (error) {
      toast.error("市价平仓失败")
    }
  }

  return (
    <div className="">
      <DashboardHeader heading="套利管理" />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {arbitrageConfigs.map((config) => (
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
              <div className="space-y-2">
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
                {config.longOrderId && (
                  <div>
                    <p className="text-sm text-muted-foreground">做多订单ID</p>
                    <p className="truncate font-medium">{config.longOrderId}</p>
                  </div>
                )}
                {config.shortOrderId && (
                  <div>
                    <p className="text-sm text-muted-foreground">做空订单ID</p>
                    <p className="truncate font-medium">{config.shortOrderId}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleMarketClose(config.id)}>
                市价全平
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleLimitClose(config.id)}>
                限价全平
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

