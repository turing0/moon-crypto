"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function FundingPage({ params }: { params: { symbol: string } }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-4xl font-bold">Funding for {params.symbol}</h1>
      <p className="mb-8 text-xl">This page would display funding information for {params.symbol}.</p>
      <Button>
        <Link href="/">Back to Arbitrage</Link>
      </Button>
    </div>
  )
}
