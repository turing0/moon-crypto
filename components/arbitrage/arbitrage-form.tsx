"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "../shared/icons"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function ArbitrageForm() {
  const [symbol, setSymbol] = useState("")
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (symbol) {
      router.push(`arbitrage/funding/${symbol.toUpperCase()}`)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSubmit} className="w-full sm:max-w-lg sm:flex-1">
          <div className="flex w-full gap-2">
            <Input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. BTC"
              className="flex-1"
              required
            />
            <Button type="submit" className="whitespace-nowrap">
              Open Funding Page
            </Button>
          </div>
        </form>

        <div className="mt-2 w-full sm:mt-0 sm:w-auto">
          {session && <Link href="/arbitrage/manage">
            <Button variant="outline" className="w-full sm:w-auto">
              <Icons.settings className="mr-2 size-4" />
              Manage Arbitrage
            </Button>
          </Link>}
        </div>
      </div>
    </div>
  )
}

