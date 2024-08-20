"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { unstable_noStore as noStore } from 'next/cache';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Input } from "@/components/ui/input"
import { updateCopyTradingSchema, UpdateCopyTradingSchema } from "@/lib/validations/exchange"
import { CopyTradingSettingInfo } from "../table/columns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Checkbox } from "../ui/checkbox"
import { updateCopyTradingSetting } from "@/actions/copy-trading"

interface UpdateCopyTradingSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  task: CopyTradingSettingInfo
  onSuccess?: () => void
}

export function UpdateCopyTradingSheet({ task, onSuccess, ...props }: UpdateCopyTradingSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()
  const [secretUpdated, setSecretUpdated] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState( task.fixedAmount? 'fixed':'multiplier');

  // const handleSecretChange = (e) => {
  //   setSecretUpdated(e.target.value !== '');
  //   form.setValue('secret', e.target.value);
  // };
  const userApi = task.followedApis
  const form = useForm<UpdateCopyTradingSchema>({
    resolver: zodResolver(updateCopyTradingSchema),
    defaultValues: {
      fixedAmount: task.fixedAmount?.toString() ?? "",
      multiplierAmount: task.multiplierAmount?.toString() ?? "",
      takeProfit: task.takeProfit?.toString() ?? "",
      stopLoss: task.stopLoss?.toString() ?? "",
      // followedApis: task.followedApis,
      // secret: "",
      // description: task.description ?? "",
    },
  })

  function onSubmit(input: UpdateCopyTradingSchema) {
    // noStore();
    startUpdateTransition(async () => {
      const updateData: any = {
        id: task.id,
        takeProfit: input.takeProfit,
        stopLoss: input.stopLoss,
        // apis: input.apis,
      };
      if (input.fixedAmount) {
        updateData.fixedAmount = input.fixedAmount;
      }
      if (input.multiplierAmount) {
        updateData.multiplierAmount = input.multiplierAmount;
      }
      // if (input.takeProfit) {
      //   updateData.takeProfit = input.takeProfit;
      // }
      // if (input.stopLoss) {
      //   updateData.stopLoss = input.stopLoss;
      // }

      // const { error } = await updateExchangeAPI({
      //   id: task.id,
      //   ...input,
      // })
      const { error } = await updateCopyTradingSetting(updateData);

      if (error) {
        toast.error(error, {position: "top-center"})
        return
      }

      form.reset()
      props.onOpenChange?.(false)
      toast.success("Copy-Trading setting updated", {position: "top-center"})
      onSuccess?.()
    })
  }
  
  // React.useEffect(() => {
  //   // Clear the form fields when the tab changes
  //   form.reset({
  //     // apis: form.getValues('apis'), // Retain the current value of apis
  //     fixedAmount: "",
  //     multiplierAmount: "",
  //   });
  // }, [activeTab, form]);
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // 在这里重置表单
    form.reset({
      // apis: form.getValues('apis'), // Retain the current value of apis
      fixedAmount: "",
      multiplierAmount: "",
      takeProfit: form.getValues('takeProfit'),
      stopLoss: form.getValues('stopLoss'),
    });
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update Copy Trading</SheetTitle>
          {/* <SheetDescription>
            Update the exchange API and save the changes
          </SheetDescription> */}
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter account name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

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
                        <p>{`You don't have any exchange APIs.`}</p>
                      </div>
                    ) : (
                    userApi.map((item) => (
                      <FormField
                        key={item.exchangeAccountId}
                        control={form.control}
                        name="apis"
                        render={({ field }) => {
                          const value = field.value || [];
                          return (
                            <FormItem
                              key={item.exchangeAccountId}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.exchangeAccountId)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...value, item.exchangeAccountId])
                                      : field.onChange(
                                          value?.filter(
                                            (v) => v !== item.exchangeAccountId
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
            
            <Tabs defaultValue={task.fixedAmount? "fixed":"multiplier"} className="space-y-4" onValueChange={handleTabChange}>
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
              
              <FormLabel className="text-base">Position Risk</FormLabel>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="takeProfit"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Take Profit</FormLabel>
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
                      <FormLabel>Stop Loss</FormLabel>
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


            {/* <FormField
              control={form.control}
              name="api"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter API key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && (
                  <ReloadIcon
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}