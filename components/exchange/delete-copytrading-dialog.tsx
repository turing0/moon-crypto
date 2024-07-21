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
import { CopyTradingSettingInfo } from "../table/columns"
import { deleteCopyTradingSetting } from "@/actions/copy-trading"

interface DeleteCopyTradingDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tasks: Row<CopyTradingSettingInfo>["original"][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteCopyTradingDialog({
  tasks,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteCopyTradingDialogProps) {
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
          <DialogTitle>Unfollow Trader</DialogTitle>
          <DialogDescription>
            {"This action cannot be undone. You will no longer copy this trader's orders."}<br />
            {"If the trader has open positions, this action will close them all at market price."}
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
                const { error } = await deleteCopyTradingSetting({
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