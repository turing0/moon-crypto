"use client"

import { createCopyTradingSchema, CreateCopyTradingSchema } from "@/lib/validations/exchange"
import React, { useEffect } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"
import { createCopyTradingAPI } from "@/actions/copy-trading"


export function CopyTradeDialog({traderId, traderName, userApi}) {
    const [open, setOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState('fixed');
    const [isCreatePending, startCreateTransition] = React.useTransition()
  
    const form = useForm<CreateCopyTradingSchema>({
      resolver: zodResolver(createCopyTradingSchema),
    })
    // const { control, watch } = form;
    // console.log("CopyTradeDialog userApi:", userApi)
    function onSubmit(input: CreateCopyTradingSchema) {
      // console.log("input:", input)
      startCreateTransition(async () => {
        const { error } = await createCopyTradingAPI(traderId, traderName, input)
  
        if (error) {
          toast.error(error, {position: "top-center"})
          return
        }
  
        form.reset()
        setOpen(false)
        toast.success("Copy Trading added", {position: "top-center"})
      })
    }

    // const {data:session} = useSession();
    // const {data, status} = fetchExchangeAPIs(session?.user?.id!);
    
    // 监控输入值
    // const fixedAmount = watch('fixedAmount', '');
    // const multiplierAmount = watch('multiplierAmount', '');
    
    useEffect(() => {
      // Clear the form fields when the tab changes
      form.reset({
        apis: form.getValues('apis'), // Retain the current value of apis
        fixedAmount: "",
        multiplierAmount: "",
      });
    }, [activeTab, form]);

    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline" size="sm"> */}
          <Button className="h-7 px-2">
            Copy Trade
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Trading: {traderName}</DialogTitle>
            {/* <DialogDescription>
            </DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="apis"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Choose your exchange account</FormLabel>
                    </div>
                    {!userApi || userApi.length === 0 ? (
                      <div className="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700">
                        <p>{`You don't have any enabled exchange APIs.`}</p>
                        Please <Link href="/exchanges" className="text-blue-500 underline">add or check your APIs</Link> to proceed.
                      </div>
                    ) : (
                    // {userApi && userApi.map((item) => (
                    userApi.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="apis"
                        render={({ field }) => {
                          const value = field.value || [];
                          // const selectedIds = value.split("-").filter((v) => v);
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...value, item.id])
                                      : field.onChange(
                                          value?.filter(
                                            (v) => v !== item.id
                                          )
                                        )
                                  }}
                                  // onCheckedChange={(checked) => {
                                  //   const newSelectedIds = checked
                                  //     ? [...selectedIds, item.id]
                                  //     : selectedIds.filter((v) => v !== item.id);
                                  //   field.onChange(newSelectedIds.join("-"));
                                  // }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.accountName}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))
                  )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="fixed" className="space-y-4" onValueChange={setActiveTab}>
                <div>
                  <FormLabel className="text-base">Mode</FormLabel>
                </div>
                <TabsList>
                  <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
                  <TabsTrigger value="multiplier">Multiplier</TabsTrigger>
                </TabsList>
                <TabsContent value="fixed" className="space-y-4">
                  {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> */}
                  <div className="grid gap-4">
                    <div className="relative">
                    <FormField
                      control={form.control}
                      name="fixedAmount"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>API Key</FormLabel> */}
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Limit: 5 - 20000"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '');
                                  const numericValue = value ? Math.max(0, Math.min(20000, Number(value))) : '';
                                  field.onChange(String(numericValue));  // 更新字段值
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
                    </div>
                    <span className="text-[14px] text-gray-500 ">
                      Fixed investment: -- USDT margin
                    </span>
                    {/* <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground">
                          +19% from last month
                        </p>
                      </CardContent>
                    </Card> */}
                  </div>
                </TabsContent>
                <TabsContent value="multiplier" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="relative">
                      <FormField
                        control={form.control}
                        name="multiplierAmount"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>API Key</FormLabel> */}
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Limit: 0.01 - 100"
                                  {...field}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/[^0-9.]/g, '');  // 移除除数字和点之外的所有字符
                                    if (value.includes('.')) {
                                      // 如果存在小数点，拆分整数部分和小数部分
                                      let parts = value.split('.');
                                      // 只保留小数点后的前两位数字
                                      if (parts[1].length > 2) {
                                        parts[1] = parts[1].substring(0, 2);
                                      }
                                      // 重新组合整数和小数部分
                                      value = parts[0] + '.' + parts[1];
                                    }
                                    field.onChange(value);
                                  }}
                                  // onBlur={(e) => {
                                  //   // 当用户离开输入框时，对数值进行最终的范围限制
                                  //   let value = parseFloat(e.target.value);
                                  //   if (!isNaN(value)) {
                                  //     value = Math.max(0.01, Math.min(100, value));
                                  //     field.onChange(value.toFixed(2));
                                  //   }
                                  // }}
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
                    </div>
                    <span className=" text-[14px] text-gray-500">
                      Copy traders place -- times the size of the orders of the elite trader.
                    </span>
                  </div>
                </TabsContent>
              </Tabs>

              {/* <FormField
                control={form.control}
                name="passphrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copy trade settings</FormLabel>
                    <FormControl>
                      <Tabs defaultValue="fixed" className="space-y-4">
                        <TabsList>
                          <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
                          <TabsTrigger value="multiplier">Multiplier</TabsTrigger>
                        </TabsList>
                        <TabsContent value="fixed" className="space-y-4">
                          <div className="grid gap-4">
                            <div className="relative">
                              <Input
                                placeholder="Limit: 5 - 20000"
                                {...field}
                                name="fixedAmount2"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                USDT
                              </span>
                            </div>
                            <span className="text-gray-500 text-[14px] ">
                              Fixed investment: -- USDT margin
                            </span>
                          </div>
                        </TabsContent>
                        <TabsContent value="multiplier" className="space-y-4">
                          <div className="grid gap-4">
                            <div className="relative">
                              <Input
                                placeholder="Limit: 0.01 - 100"
                                {...field}
                                name="multiplierAmount2"
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                X
                              </span>
                            </div>
                            <span className="text-gray-500 text-[14px] ">
                              Copy traders place -- times the size of the orders of the elite trader.
                            </span>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              
              <DialogFooter className="gap-2 pt-2 sm:space-x-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button disabled={isCreatePending}>
                  {isCreatePending && (
                    <ReloadIcon
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  Follow Trading
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

