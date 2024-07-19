"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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
import { createExchangeAPI } from "@/actions/exchange"
import { CreateExchangeApiSchema, createExchangeApiSchema } from "@/lib/validations/exchange"
import { Icons } from "../shared/icons"

const exchanges =  ["Binance", "Bitget", "Bybit", "OKX", "Bitfinex"]
const exchangesRequiringPassphrase = ["OKX", "Bitget"];

export function CreateExchangeDialog({userid, ipdata}) {
  const [open, setOpen] = React.useState(false)
  const [selectedExchange, setSelectedExchange] = React.useState("");
  const [isCreatePending, startCreateTransition] = React.useTransition()
  // const [isExpanded, setIsExpanded] = React.useState(false)

  const form = useForm<CreateExchangeApiSchema>({
    resolver: zodResolver(createExchangeApiSchema),
  })

  function onSubmit(input: CreateExchangeApiSchema) {
    startCreateTransition(async () => {
      const { error } = await createExchangeAPI(userid, input)

      if (error) {
        toast.error(error, {position: "top-center"})
        return
      }

      form.reset()
      setOpen(false)
      toast.success("Exchange API added", {position: "top-center"})
    })
  }

  const whitelistIPs = ipdata
  const whitelistIPsString = whitelistIPs.join(',')
  // const displayIPs = isExpanded 
  // ? whitelistIPsString 
  // : whitelistIPs.slice(0, 2).join(',') + (whitelistIPs.length > 2 ? '...' : '')
  const displayIPs = whitelistIPs.slice(0, 2).join(',') + (whitelistIPs.length > 2 ? '...' : '')
  const showPassphrase = exchangesRequiringPassphrase.includes(selectedExchange);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whitelistIPsString)
    toast.success("IP addresses copied", {position: "top-center"})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button variant="outline" size="sm"> */}
        <Button>
          <PlusIcon className="mr-2 size-4" aria-hidden="true" />
          Add exchange
        </Button>
      </DialogTrigger>
      {/* <DialogContent className={"overflow-y-scroll max-h-screen"}> */}
      <DialogContent className={"max-h-[90vh] overflow-auto"}>
        <DialogHeader>
          <DialogTitle>Add exchange</DialogTitle>
          <DialogDescription className="hidden sm:block">
            Fill in the details below to create a new exchange api.
          </DialogDescription>
        </DialogHeader>
        
        <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Whitelist IP Addresses:</p>
          <div className="mt-1 flex items-start">
            <code className="max-h-20 max-w-[calc(100%-140px)] overflow-x-auto rounded border border-gray-300 bg-white px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
              {displayIPs}
            </code>
            <div className="ml-2 flex flex-col space-y-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="shrink-0 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Icons.copy className="mr-1 h-4 w-4" aria-hidden="true" />
                Copy
              </Button>
              {/* {whitelistIPs.length > 3 && (
                <Button
                  onClick={toggleExpand}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  {isExpanded ? (
                    <>
                      <Icons.chevronDown className="mr-2 size-4" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <Icons.chevronDown className="mr-2 size-4" />
                      Expand
                    </>
                  )}
                </Button>
              )} */}
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{"Turn on IP whitelisting and copy/paste these IP addresses."}</p>
        </div>

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
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedExchange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select exchange" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {exchanges.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
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
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter API secret"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showPassphrase && (<FormField
              control={form.control}
              name="passphrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passphrase</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter passphrase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            {/* <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      className="resize-none"
                      {...field}
                    />
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
                Add Exchange API 
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}