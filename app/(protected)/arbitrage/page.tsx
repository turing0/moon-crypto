"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tab, TabList, TabPanel, Tabs as Tabs2 } from "@/components/v2/tabs/tabs"
import { Search } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
// import { Input } from "@/components/ui/input-table"
import { usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/table/data-table"
import { bitgetCurrentOrderColumns, okxOrderColumns, orderColumns } from "@/components/table/columns"
import { Skeleton, TableSkeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import ArbitrageForm from "@/components/arbitrage/arbitrage-form"

export default function ArbitragePage() {
  
  return (
    <>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {/* <Link href="/copy-trading" className="mb-2 inline-flex cursor-pointer items-center">
          <Icons.arrowLeft className="mr-1 h-4 w-4" />
          <span>Explore Traders</span>
        </Link> */}
      </div >

      <div className="flex flex-col items-center justify-center p-24">
      
        <h1 className="text-4xl font-bold mb-8">Arbitrage</h1>
        <ArbitrageForm />

      </div>
    </>
  )
}
