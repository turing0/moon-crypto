"use client"

import React, { useEffect } from "react"
import { toast } from "sonner"
import { createCopyTradingSchema, CreateCopyTradingSchema } from "@/lib/validations/exchange"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { createCopyTradingAPI } from "@/actions/copy-trading"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Icons } from "@/components/shared/icons"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BitGetHistoryOrder } from "@/app/(protected)/analysis/page"

async function getBitgetTrader(traderId: string) {
  try {
    const response = await fetch(`https://tdb.mooncryp.to/api/bitget/traders?traderId=${traderId}`)
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const {data, pageCount} = await response.json() as { data: BitGetHistoryOrder[], pageCount: number }
    console.log("getBitgetTrader data:", data);
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unknown error occurred, check console for more message", {
        position: "top-center",
      });
    }
    console.error("Failed to fetch order data:", error);
    return [];
  }
}

interface SearchParams {
  // [key: string]: string | string[] | undefined
  [key: string]: string | undefined
}
// interface AddCopyTradePageProps {
//   traderId: string;
//   traderName: string;
//   userApi: Array<{ id: string; accountName: string }>;
// }
interface AddCopyTradePageProps {
  searchParams: SearchParams
}

export default function AddCopyTradePage({ searchParams }: AddCopyTradePageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('fixed');
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  const [isCreatePending, startCreateTransition] = React.useTransition()
  const [userApi, setUserApi] = React.useState<any[]>([]);
  const [traderInfo, setTraderInfo] = React.useState<any>({});
  
  console.log("searchParams", searchParams)

  const {data:session} = useSession();
  useEffect(() => {
    if (!session?.user?.id) {
      // console.log('Session not loaded yet or user ID not available');
      return;
    }
    async function fetchUserApiData() {
      try {
        const response = await fetch('/api/userApi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session?.user.id }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("userApi data:", data)
          setUserApi(data);
        } else {
          console.error('Failed to fetch user data:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }

    fetchUserApiData();
  }, [session]);

  const bitgetTraderIdParam = searchParams.bitgetTraderId
  const traderNameParam = searchParams.traderName
  
  const [bitgetTraderId, setBitgetTraderId] = React.useState<string>(bitgetTraderIdParam?bitgetTraderIdParam:'');
  const [isLoading, setIsLoading] = React.useState<boolean>(bitgetTraderId?true:false);

  useEffect(() => {
    if (bitgetTraderId) {
      getBitgetTrader(bitgetTraderId).then(data => {
        if (data.length > 0) {
          setTraderInfo(data[0])
        }
      })
    }
  }, [bitgetTraderId]);

  const form = useForm<CreateCopyTradingSchema>({
    resolver: zodResolver(createCopyTradingSchema),
  })

  function onSubmit(input: CreateCopyTradingSchema) {
    startCreateTransition(async () => {
      const { error } = await createCopyTradingAPI(bitgetTraderId, traderInfo.traderName, input)

      if (error) {
        toast.error(error, {position: "top-center"})
        return
      }

      form.reset()
      toast.success("Copy Trading added", {position: "top-center"})
      router.push('/dashboard') // Redirect to dashboard or appropriate page
    })
  }

  useEffect(() => {
    form.reset({
      apis: form.getValues('apis'),
      fixedAmount: "",
      multiplierAmount: "",
      takeProfit: form.getValues('takeProfit'),
      stopLoss: form.getValues('stopLoss'),
    });
  }, [activeTab, form]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">Copy Trading: {traderInfo.traderName}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="apis"
            render={() => (
              <FormItem>
                <FormLabel className="text-lg">Choose your exchange account</FormLabel>
                {!userApi || userApi.length === 0 ? (
                  <div className="rounded border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700">
                    <p>{`You don't have any enabled exchange APIs.`}</p>
                    Please <Link href="/exchanges" className="text-blue-500 underline">add or check your APIs</Link> to proceed.
                  </div>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-4">
                    {userApi.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="apis"
                        render={({ field }) => {
                          const value = field.value || [];
                          return (
                            <FormItem key={item.id} className="flex items-center space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...value, item.id])
                                      : field.onChange(value?.filter((v) => v !== item.id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="h-full font-normal">{item.accountName}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Tabs defaultValue="fixed" className="space-y-6" onValueChange={setActiveTab}>
            <div>
              <FormLabel className="text-lg">Mode</FormLabel>
            </div>
            <TabsList>
              <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
              <TabsTrigger value="multiplier">Multiplier</TabsTrigger>
            </TabsList>
            <TabsContent value="fixed" className="space-y-4">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="fixedAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Limit: 5 - 20000"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const numericValue = value ? Math.max(0, Math.min(20000, Number(value))) : '';
                              field.onChange(String(numericValue));
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            USDT
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-500">
                  Fixed investment: {form.watch('fixedAmount') || '--'} USDT margin
                </span>
              </div>
            </TabsContent>
            <TabsContent value="multiplier" className="space-y-4">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="multiplierAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Limit: 0.01 - 100"
                            {...field}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^0-9.]/g, '');
                              if (value.includes('.')) {
                                let parts = value.split('.');
                                if (parts[1].length > 2) {
                                  parts[1] = parts[1].substring(0, 2);
                                }
                                value = parts[0] + '.' + parts[1];
                              }
                              field.onChange(value);
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            X
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-500">
                  Copy traders place {form.watch('multiplierAmount') || '--'} times the size of the orders of the elite trader.
                </span>
              </div>
            </TabsContent>
          </Tabs>

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="space-y-4"
          >
            <CollapsibleTrigger asChild>
              <div className="flex cursor-pointer items-center space-x-2">
                <FormLabel className="cursor-pointer text-lg">More Settings</FormLabel>
                {isAdvancedOpen ? <Icons.chevronUp className="h-4 w-4" /> : <Icons.chevronDown className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Take-Profit Ratio</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Limit: 0 - 2000"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const numericValue = value ? Math.max(0, Math.min(2000, Number(value))) : '';
                              field.onChange(String(numericValue));
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stopLoss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stop-Loss Ratio</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Limit: 0 - 500"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const numericValue = value ? Math.max(0, Math.min(500, Number(value))) : '';
                              field.onChange(String(numericValue));
                            }}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              Copy Now
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}