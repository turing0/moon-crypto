"use client"

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from '@/components/shared/icons'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function FundingPage({ params }: { params: { symbol: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Funding for {params.symbol}</h1>
      <p className="text-xl mb-8">This page would display funding information for {params.symbol}.</p>
      <Button>
        <Link href="/">Back to Arbitrage</Link>
      </Button>
    </div>
  )
}
