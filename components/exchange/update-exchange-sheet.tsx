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
import { useState } from "react"
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page"
import { updateExchangeAPI } from "@/actions/exchange"
import { updateExchangeApiSchema, UpdateExchangeApiSchema } from "@/lib/validations/exchange"

interface UpdateExchangeApiSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  task: ExchangeApiInfo
}

export function UpdateExchangeApiSheet({ task, ...props }: UpdateExchangeApiSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()
  const [secretUpdated, setSecretUpdated] = useState(false);
  const [passphraseUpdated, setPassphraseUpdated] = useState(false);
  
  const handleSecretChange = (e) => {
    setSecretUpdated(e.target.value !== '');
    form.setValue('secret', e.target.value);
  };

  const handlePassphraseChange = (e) => {
    setPassphraseUpdated(e.target.value !== '');
    form.setValue('passphrase', e.target.value);
  };

  const form = useForm<UpdateExchangeApiSchema>({
    resolver: zodResolver(updateExchangeApiSchema),
    defaultValues: {
      // title: task.title ?? "",
      accountName: task.accountName,
      api: task.apiKey,
      secret: "",
      passphrase: "",
      // description: task.description ?? "",
    },
  })

  function onSubmit(input: UpdateExchangeApiSchema) {
    // noStore();
    startUpdateTransition(async () => {
      const updateData: any = {
        id: task.id,
        accountName: input.accountName,
        api: input.api,
        description: input.description,
      };

      if (secretUpdated) {
        updateData.secret = input.secret;
      }

      if (passphraseUpdated) {
        updateData.passphrase = input.passphrase;
      }

      // const { error } = await updateExchangeAPI({
      //   id: task.id,
      //   ...input,
      // })
      const { error } = await updateExchangeAPI(updateData);

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      props.onOpenChange?.(false)
      toast.success("API updated")
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update API</SheetTitle>
          <SheetDescription>
            Update the exchange API and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
                      type="password"
                      defaultValue="password"
                      onChange={handleSecretChange}
                      // {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passphrase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passphrase</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter passphrase"
                      type="password"
                      defaultValue="password"
                      onChange={handlePassphraseChange}
                      // {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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