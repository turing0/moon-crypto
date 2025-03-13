"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/header"
import { cancelArbitrage, getArbitrageConfig, limitClose, marketClose } from "@/actions/arbitrage"
import { useSession } from "next-auth/react"
import { PackageSearch, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

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

const PositionStatus = ({
  type,
  orderId,
  closeOrderId,
}: {
  type: "long" | "short"
  orderId: string | null
  closeOrderId?: string | null
}) => {
  const isLong = type === "long"
  const positionLabel = isLong ? "做多" : "做空"
  const icon = isLong ? (
    <ArrowUpRight className="size-4 text-green-600" />
  ) : (
    <ArrowDownRight className="size-4 text-red-600" />
  )

  // Opening position error state
  if (orderId?.startsWith("error")) {
    return (
      <div className="flex flex-col space-y-2 rounded-md border border-destructive/20 bg-destructive/5 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{positionLabel}仓位</span>
          </div>
          <Badge variant="destructive">开仓失败</Badge>
        </div>
        <p className="text-sm text-destructive">{orderId.replace("error:", "")}</p>
      </div>
    )
  }

  // Closing position error state
  if (closeOrderId?.startsWith("error")) {
    return (
      <div className="flex flex-col space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{positionLabel}仓位</span>
          </div>
          <Badge className="bg-amber-100 text-amber-800">平仓失败</Badge>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="size-3.5" />
            <span>开仓成功:</span>
            <code className="text-xs">{orderId}</code>
          </div>
          <div className="flex items-center gap-1 text-sm text-destructive">
            <XCircle className="size-3.5" />
            <span>平仓失败:</span>
            <code className="text-xs">{closeOrderId?.replace("error:", "")}</code>
          </div>
        </div>
      </div>
    )
  }

  // Success state with close order
  if (orderId && closeOrderId && !closeOrderId.startsWith("error")) {
    return (
      <div className="flex flex-col space-y-2 rounded-md border border-green-200 bg-green-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{positionLabel}仓位</span>
          </div>
          <Badge className="bg-green-100 text-green-800">已平仓</Badge>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="size-3.5" />
            <span>开仓:</span>
            <code className="text-xs">{orderId}</code>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CheckCircle className="size-3.5" />
            <span>平仓:</span>
            <code className="text-xs">{closeOrderId}</code>
          </div>
        </div>
      </div>
    )
  }

  // Active position (opened but not closed)
  if (orderId && !closeOrderId) {
    return (
      <div className="flex flex-col space-y-2 rounded-md border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{positionLabel}仓位</span>
          </div>
          <Badge className="bg-blue-100 text-blue-800">已开仓</Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle className="size-3.5" />
          <span>订单ID:</span>
          <code className="text-xs">{orderId}</code>
        </div>
      </div>
    )
  }

  // Pending state
  return (
    <div className="flex flex-col space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{positionLabel}仓位</span>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">待下单</Badge>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="size-3.5" />
        <span>等待执行...</span>
      </div>
    </div>
  )
}

export default function ArbitrageManagementPage() {
  const { data: session } = useSession()
  const [arbitrageConfigs, setArbitrageConfigs] = useState<ArbitrageConfig[] | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("active")
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    action: () => Promise<void>
    title: string
    description: string
  }>({
    isOpen: false,
    action: async () => {},
    title: "",
    description: "",
  })

  useEffect(() => {
    if (!session) return

    async function fetchArbitrageConfigs() {
      setIsLoading(true)
      try {
        const configs = await getArbitrageConfig(session?.user.id!)
        setArbitrageConfigs(configs)
      } catch (error) {
        toast.error("获取套利配置失败")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArbitrageConfigs()
  }, [session])

  const handleLimitClose = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      action: async () => {
        try {
          await limitClose(id)
          toast.success("限价平仓指令已发送")
        } catch (error) {
          toast.error("限价平仓失败")
        }
      },
      title: "确认限价全平",
      description: "您确定要执行限价全平操作吗？这将关闭所有的仓位（读取orderbook的价格）。",
    })
  }

  const handleMarketClose = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      action: async () => {
        try {
          await marketClose(id)
          toast.success("市价平仓指令已发送")
        } catch (error) {
          toast.error("市价平仓失败")
        }
      },
      title: "确认市价全平",
      description: "您确定要执行市价全平操作吗？这将立即以市价关闭所有的仓位。",
    })
  }

  const handleCancelArbitrage = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      action: async () => {
        try {
          const result = await cancelArbitrage(id)
          if (result?.error) {
            throw new Error(result?.error);
          }
          toast.success("套利已取消")

        } catch (error) {
          toast.error("取消套利失败", {
            description: error.message,
          })
        }
      },
      title: "确认取消套利",
      description: "您确定要取消此套利吗？已成交订单将会市价平仓，未成交订单将会立即取消。",
    })
  }

  // Filter configs based on active tab
  const filteredConfigs = arbitrageConfigs?.filter((config) => {
    if (activeTab === "active") {
      return config.status.toLowerCase() === "active" || config.status.toLowerCase() === "pending"
    } else if (activeTab === "ended") {
      return config.status.toLowerCase() === "ended"
    }
    return true
  })

  const renderConfigCards = (configs: ArbitrageConfig[] | undefined) => {
    if (isLoading) {
      return (
        <div className="col-span-full flex h-40 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">加载套利配置中...</p>
          </div>
        </div>
      )
    }

    if (!configs || configs.length === 0) {
      return (
        <Card className="col-span-full">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <PackageSearch className="size-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              {activeTab === "active" ? "暂无活跃套利配置" : "暂无已结束套利配置"}
            </h3>
            <p className="max-w-sm text-muted-foreground">
              {activeTab === "active"
                ? "当前没有任何活跃的套利配置。您可以创建新的套利配置来开始交易。"
                : "当前没有任何已结束的套利配置。"}
            </p>
            {activeTab === "active" && (
              <Button className="mt-4">
                <Link href="/arbitrage">创建套利</Link>
              </Button>
            )}
          </div>
        </Card>
      )
    }

    return configs.map((config) => (
      <Card key={config.id} className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="bg-muted/30 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/arbitrage/funding/${config.symbol}`} className="hover:underline">
                <CardTitle className="text-xl font-bold">{config.symbol}</CardTitle>
              </Link>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                {config.leverage}x
              </Badge>
            </div>
            <Badge className={`${getStatusColor(config.status)}`}>{config.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">做多类型</p>
              <p className="font-medium">{config.longType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">做空类型</p>
              <p className="font-medium">{config.shortType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">单边金额</p>
              <p className="font-medium">{config.amount} USDT</p>
            </div>
            <div>
              <p className="text-muted-foreground">初始资金费率</p>
              <p className="font-medium">{(config.initialFundingRate * 100).toFixed(4)}%</p>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm text-muted-foreground">平仓条件</p>
            <p className="text-sm font-medium">
              {config.closeCondition}
              {/* {config.closeOnRate && ` (${(config.closeOnRate * 100).toFixed(4)}%)`} */}
            </p>
          </div>

          <Separator className="my-3" />

          <div className="mb-3 text-xs text-muted-foreground">创建于 {new Date(config.createdAt).toLocaleString()}</div>

          {/* Position Status Section */}
          <div className="space-y-2">
            <PositionStatus type="long" orderId={config.longOrderId} closeOrderId={config.closeLongOrderId} />
            <PositionStatus type="short" orderId={config.shortOrderId} closeOrderId={config.closeShortOrderId} />
          </div>
        </CardContent>

        {config.status.toLowerCase() === "active" && (
          <CardFooter className="flex justify-end gap-2 bg-muted/10 p-3 pt-2">
            {config.longOrderId || config.shortOrderId ? (
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
        )}
      </Card>
    ))
  }

  return (
    <>
      <DashboardHeader heading="套利管理" />

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active">活跃套利</TabsTrigger>
          <TabsTrigger value="ended">已结束套利</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {renderConfigCards(filteredConfigs)}
          </div>
        </TabsContent>

        <TabsContent value="ended" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {renderConfigCards(filteredConfigs)}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) => setConfirmDialog((prev) => ({ ...prev, isOpen }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await confirmDialog.action()
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
              }}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

