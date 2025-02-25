"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/table/data-table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/shared/icons"
import { toast } from "sonner"
import { Banknote, DollarSign } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/header"

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
  createdAt: string
  updatedAt: string
}

export default function ArbitrageManagementPage() {
  const [arbitrageConfigs, setArbitrageConfigs] = useState<ArbitrageConfig[]>([])

  useEffect(() => {
    // Fetch arbitrage configs from your API
    fetchArbitrageConfigs()
  }, [])

  const fetchArbitrageConfigs = async () => {
    // Replace this with your actual API call
    const response = await fetch("/api/arbitrage-configs")
    const data = await response.json()
    setArbitrageConfigs(data)
  }

  const handleLimitClose = async (id: string) => {
    try {
      // Replace this with your actual API call
      await fetch(`/api/arbitrage-configs/${id}/limit-close`, { method: "POST" })
      toast.success("限价平仓指令已发送")
      fetchArbitrageConfigs() // Refresh the data
    } catch (error) {
      toast.error("限价平仓失败")
    }
  }

  const handleMarketClose = async (id: string) => {
    try {
      // Replace this with your actual API call
      await fetch(`/api/arbitrage-configs/${id}/market-close`, { method: "POST" })
      toast.success("市价平仓指令已发送")
      fetchArbitrageConfigs() // Refresh the data
    } catch (error) {
      toast.error("市价平仓失败")
    }
  }

  const columns = [
    { accessorKey: "symbol", header: "交易对" },
    { accessorKey: "longType", header: "做多类型" },
    { accessorKey: "shortType", header: "做空类型" },
    { accessorKey: "amount", header: "单边投资金额", cell: ({ row }) => `$${row.original.amount.toLocaleString()}` },
    { accessorKey: "leverage", header: "杠杆" },
    {
      accessorKey: "initialFundingRate",
      header: "初始资金费率",
      cell: ({ row }) => `${(row.original.initialFundingRate * 100).toFixed(4)}%`,
    },
    { accessorKey: "closeCondition", header: "平仓条件" },
    {
      accessorKey: "closeOnRate",
      header: "平仓汇率",
      cell: ({ row }) => (row.original.closeOnRate ? `${(row.original.closeOnRate * 100).toFixed(4)}%` : "N/A"),
    },
    { accessorKey: "status", header: "状态" },
    {
      accessorKey: "createdAt",
      header: "创建时间",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleLimitClose(row.original.id)}>
            <DollarSign className="mr-2 h-4 w-4" />
            限价平仓
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMarketClose(row.original.id)}>
            <Banknote className="mr-2 h-4 w-4" />
            市价平仓
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="">
      <DashboardHeader
        heading="套利管理"
      />

      <DataTable columns={columns} data={arbitrageConfigs} />

    </div>
  )
}

