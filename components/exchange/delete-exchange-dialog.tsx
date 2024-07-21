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
import { deleteExchangeAPI } from "@/actions/exchange"
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page"


interface DeleteExchangeApiDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Row<ExchangeApiInfo>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteExchangeApiDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteExchangeApiDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition()

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({tasks.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete API</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete this API from our servers.
            <div className="font-semibold">
              If the current API has open positions, this action will close them all at market price.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={() => {
              startDeleteTransition(async () => {
                const { error } = await deleteExchangeAPI({
                  ids: tasks.map((task) => task.id),
                })

                if (error) {
                  toast.error(error, {position: "top-center"})
                  return
                }

                props.onOpenChange?.(false)
                toast.success("API deleted", {position: "top-center"})
                onSuccess?.()
              })
            }}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}