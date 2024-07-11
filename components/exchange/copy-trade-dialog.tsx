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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { ReloadIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCopyTradingAPI } from "@/actions/exchange"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"



export function CopyTradeDialog({traderId, name}) {
    const [open, setOpen] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState('fixed');
    const [isCreatePending, startCreateTransition] = React.useTransition()
  
    const form = useForm<CreateCopyTradingSchema>({
      resolver: zodResolver(createCopyTradingSchema),
    })
    // const { control, watch } = form;
  
    function onSubmit(input: CreateCopyTradingSchema) {
      startCreateTransition(async () => {
        const { error } = await createCopyTradingAPI(traderId, input)
  
        if (error) {
          toast.error(error)
          return
        }
  
        form.reset()
        setOpen(false)
        toast.success("Exchange API added")
      })
    }

    // 监控输入值
    // const fixedAmount = watch('fixedAmount', '');
    // const multiplierAmount = watch('multiplierAmount', '');
    
    useEffect(() => {
      // Clear the form fields when the tab changes
      form.reset({
        fixedAmount: '',
        multiplierAmount: '',
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
            <DialogTitle>Start Copy Trading</DialogTitle>
            <DialogDescription>
              Trader: {name}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="exchange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select exchange" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {/* {exchanges.map((item) => (
                            <SelectItem
                              key={item}
                              value={item}
                              className="capitalize"
                            >
                              {item}
                            </SelectItem>
                          ))} */}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
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
              />

              <Tabs defaultValue="fixed" className="space-y-4" onValueChange={setActiveTab}>
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
                            <div>
                              <Input
                                placeholder="Limit: 5 - 20000"
                                {...field}
                              />
                              {/* <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"> */}
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500">
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
                              <div>
                                <Input
                                  placeholder="Limit: 0.01 - 100"
                                  {...field}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500">
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

