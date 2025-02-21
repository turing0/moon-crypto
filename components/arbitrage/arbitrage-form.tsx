"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ArbitrageForm() {
  const [symbol, setSymbol] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (symbol) {
      router.push(`arbitrage/funding/${symbol.toUpperCase()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="mb-4">
        <Label htmlFor="symbol" className="mb-2 block text-sm font-medium">
          Enter Symbol for Arbitrage
        </Label>
        <Input
          type="text"
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. BTC"
          className="w-full"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Open Funding Page
      </Button>
    </form>
  )
}

