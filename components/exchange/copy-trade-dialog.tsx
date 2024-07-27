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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Icons } from "../shared/icons"

export function CopyTradeDialog({traderId, traderName, userApi}) {
    const [open, setOpen] = React.useState(false)
    const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);    
    const [activeTab, setActiveTab] = React.useState('fixed');
    // const [fixedValue, setFixedValue] = React.useState('')
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
        takeProfit: form.getValues('takeProfit'),
        stopLoss: form.getValues('stopLoss'),
      });
    }, [activeTab, form]);

    
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button variant="outline" size="sm"> */}
          <Button className="h-7 px-2">
            Copy
          </Button>
        </DialogTrigger>
        <DialogContent className={"max-h-[90vh] overflow-auto"}>
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
                      <div className="flex flex-wrap gap-4">
                        {userApi.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="apis"
                            render={({ field }) => {
                              const value = field.value || [];
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-end space-x-2"
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
                                    />
                                  </FormControl>
                                  <FormLabel className="mb-0 pb-[2px] font-normal">
                                    {item.accountName}
                                  </FormLabel>
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

              {/* <FormField
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
                              className="flex flex-row items-start space-x-2 space-y-0"
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
              /> */}

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
                      Fixed investment: {form.watch('fixedAmount') || '--'} USDT margin
                    </span>
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
                      Copy traders place {form.watch('multiplierAmount') || '--'} times the size of the orders of the elite trader.
                    </span>
                  </div>
                </TabsContent>
              </Tabs>

              <hr></hr>

              {/* Advanced Options Section */}
              <Collapsible
                open={isAdvancedOpen}
                onOpenChange={setIsAdvancedOpen}
                className="w-full space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex cursor-pointer items-center justify-between space-x-4">
                    <div className="flex items-center space-x-2">
                      <FormLabel className="cursor-pointer text-base">More Settings</FormLabel>
                      {isAdvancedOpen ? <Icons.chevronUp className="h-4 w-4" /> : <Icons.chevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="takeProfit"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Take-Profit Ratio</FormLabel>
                          <FormControl>
                            {/* <Input {...field} /> */}
                            <div className="relative">
                                <Input
                                  placeholder="Limit: 0 - 2000"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    const numericValue = value ? Math.max(0, Math.min(20000, Number(value))) : '';
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
                        <FormItem className="flex-1">
                          <FormLabel>Stop-Loss Ratio</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Input
                                  placeholder="Limit: 0 - 500"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    const numericValue = value ? Math.max(0, Math.min(20000, Number(value))) : '';
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
              
              {/* <Collapsible
                open={isAdvancedOpen}
                onOpenChange={setIsAdvancedOpen}
                className="w-full space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between space-x-4 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <FormLabel className="text-base cursor-pointer">More Settings</FormLabel>
                      {isAdvancedOpen ? <Icons.chevronUp className="h-4 w-4" /> : <Icons.chevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Take-Profit Ratio</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="number" 
                        // value={takeProfitRatio} 
                        // onChange={(e) => setTakeProfitRatio(Number(e.target.value))}
                        className="w-20"
                      />
                      <Slider
                        // value={[takeProfitRatio]}
                        // onValueChange={(value) => setTakeProfitRatio(value[0])}
                        max={400}
                        step={1}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormLabel>Stop-Loss Ratio</FormLabel>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="number" 
                        // value={stopLossRatio} 
                        // onChange={(e) => setStopLossRatio(Number(e.target.value))}
                        className="w-20"
                      />
                      <Slider
                        // value={[stopLossRatio]}
                        // onValueChange={(value) => setStopLossRatio(value[0])}
                        max={400}
                        step={1}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible> */}

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
                  Copy Now
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

