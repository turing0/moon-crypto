"use client"

import * as React from "react"
// import { type Task } from "@/db/schema"
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
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
import { toggleEnabledExchangeAPI } from "@/actions/exchange"
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page"


interface ToggleExchangeApiDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Row<ExchangeApiInfo>["original"][]
  status: boolean
  showTrigger?: boolean
  onSuccess?: () => void
}

export function EnabledExchangeApiDialog({
  status,
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: ToggleExchangeApiDialogProps) {
  const [isEnablePending, startEnableTransition] = React.useTransition()

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Disable ({tasks.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable API</DialogTitle>
          <DialogDescription className="text-base font-semibold">
            If the current API has open positions, this action will close them all at market price.<br />
            Additionally, if this API is included in any copy-trading settings, it will also be removed from those settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Enable selected rows"
            variant="destructive"
            onClick={() => {
              startEnableTransition(async () => {
                const { error } = await toggleEnabledExchangeAPI({
                  ids: tasks.map((task) => task.id),
                }, status)

                if (error) {
                  toast.error(error)
                  return
                }

                props.onOpenChange?.(false)
                // toast.success("API disabled")
                onSuccess?.()
              })
            }}
            disabled={isEnablePending}
          >
            {isEnablePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Disable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

