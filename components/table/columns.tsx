"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import Link from "next/link"
import { BitGetHistoryOrder, OkxHistoryOrder } from "@/app/(tools)/analysis/page"
import { DataTableColumnHeader } from "./data-table-column-header"
import { ExchangeApiInfo } from "@/app/(protected)/exchanges/page"
import { UpdateExchangeApiSheet } from "../exchange/update-exchange-sheet"
import { DeleteExchangeApiDialog } from "../exchange/delete-exchange-dialog"
import { BitgetTrader } from "@/app/(protected)/traders/page"
import { Icons } from "../shared/icons"
import { CopyTradeDialog } from "../exchange/copy-trade-dialog"

// export const orderColumns: ColumnDef<datarow>[] = [
export const orderColumns: ColumnDef<BitGetHistoryOrder>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "symbol",
    header: "Position",
    cell: ({ row }) => (
      <div>{row.getValue("symbol")}</div>
    ),
  },
  {
    accessorKey: "posSide",
    header: "Side",
    cell: ({ row }) => (
      <div>{row.getValue("posSide")}</div>
    ),
  },
  {
    accessorKey: "openSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       数量
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   )
    // },
    cell: ({ row }) => (
      <div>{row.getValue("openSize")}</div>
    ),
  },
  {
    accessorKey: "openPriceAvg",
    header: "OpenPriceAvg",
    cell: ({ row }) => (
      <div>{row.getValue("openPriceAvg")} USDT</div>
    ),
  },
  {
    accessorKey: "closePriceAvg",
    header: "ClosePriceAvg",
    cell: ({ row }) => (
      <div>{row.getValue("closePriceAvg")} USDT</div>
    ),
  },
  {
    accessorKey: "margin",
    header: "Margin",
    cell: ({ row }) => {
      const margin2 = row.getValue("closePriceAvg") as number;
      const margin1 = row.getValue("openPriceAvg") as number;
      const size = row.getValue("openSize") as number;
      var margin = size*(margin2 - margin1);
      if (row.getValue("posSide")=="short") {
        margin = -margin;
      }
      const marginFormatted = margin.toFixed(2);
      const textColor = margin >= 0 ? "text-green-500" : "text-red-500";
      const formattedMarginAmount = margin >= 0 ? `+${marginFormatted}` : marginFormatted;

      return (
        <div className="w-5 whitespace-nowrap">
          <span className={textColor}>{formattedMarginAmount}</span> USDT
        </div>
      )
    },
    // enableSorting: false,
  },
  {
    accessorKey: "trackingNo",
    // header: ({ column }) => (
    //       <DataTableColumnHeader column={column} title="trackingNo" />
    //     ),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TrackingNo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("trackingNo")}</div>
    ),
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  // },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"))

  //     // Format the amount as a dollar amount
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount)

  //     return <div className="text-right font-medium">{formatted}</div>
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const datarow = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(datarow.trackingNo)}
            >
              Copy TrackingNo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            {/* <DropdownMenuItem>View datarow details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const okxOrderColumns: ColumnDef<OkxHistoryOrder>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "instId",
    header: "仓位",
    cell: ({ row }) => (
      <div>{row.getValue("instId")}</div>
    ),
  },
  {
    accessorKey: "posSide",
    header: "方向",
    cell: ({ row }) => (
      <div>{row.getValue("posSide")}</div>
    ),
  },
  {
    accessorKey: "subPos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="数量" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue("subPos")}</div>
    ),
  },
  {
    accessorKey: "openAvgPx",
    header: "持仓均价",
    cell: ({ row }) => (
      <div>{row.getValue("openAvgPx")} USDT</div>
    ),
  },
  {
    accessorKey: "closeAvgPx",
    header: "平仓价",
    cell: ({ row }) => (
      <div>{row.getValue("closeAvgPx")} USDT</div>
    ),
  },
  {
    accessorKey: "margin",
    header: "已实现盈亏",
    cell: ({ row }) => {
      const margin2 = row.getValue("closeAvgPx") as number;
      const margin1 = row.getValue("openAvgPx") as number;
      const size = row.getValue("subPos") as number;
      var margin = size*(margin2 - margin1);
      if (row.getValue("posSide")=="short") {
        margin = -margin;
      }
      const marginFormatted = margin.toFixed(2);
      const textColor = margin >= 0 ? "text-green-500" : "text-red-500";
      const formattedMarginAmount = margin >= 0 ? `+${marginFormatted}` : marginFormatted;

      return (
        <div className="w-5 whitespace-nowrap">
          <span className={textColor}>{formattedMarginAmount}</span> USDT
        </div>
      )
    },
    // enableSorting: false,
  },
  {
    accessorKey: "subPosId",
    // header: ({ column }) => (
    //       <DataTableColumnHeader column={column} title="trackingNo" />
    //     ),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          订单编号
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("subPosId")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const datarow = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(datarow.subPosId)}
            >
              Copy SubPosId
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            {/* <DropdownMenuItem>View datarow details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const bitgetTraderColumns: ColumnDef<BitgetTrader>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "traderName",
    header: "TraderName",
    cell: ({ row }) => (
      <div>{row.getValue("traderName")}</div>
    ),
  },
  {
    accessorKey: "TotalPnL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total PnL" />
    ),
    cell: ({ row }) => {
      const columnList = row.original.columnList;
      const pnlItem = columnList[1];
      const pnlValue = pnlItem ? pnlItem.value : "";
      return <div>{pnlValue}</div>;
    },
  },
  {
    accessorKey: "ROI",
    // header: "ROI",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROI" />
    ),
    cell: ({ row }) => {
      const columnList = row.original.columnList;
      const roiItem = columnList[0];
      const roiValue = roiItem ? roiItem.value : "";
      return <div>{roiValue}%</div>;
    },
  },
  {
    accessorKey: "AUM",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="AUM" />
    ),
    // header: ({ column }) => {
    //   return (
    //     <Button
    //       variant="ghost"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       数量
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   )
    // },
    cell: ({ row }) => {
      const columnList = row.original.columnList;
      const aumItem = columnList[3];
      const aumValue = aumItem ? aumItem.value : "";
      return <div>{aumValue}</div>;
    },
  },
  {
    accessorKey: "Maxdrawdown",
    header: "Max drawdown",
    cell: ({ row }) => {
      const columnList = row.original.columnList;
      const aumItem = columnList[4];
      const aumValue = aumItem ? aumItem.value : "";
      return <div>{aumValue}%</div>;
    },
  },
  // {
  //   accessorKey: "margin",
  //   header: "已实现盈亏",
  //   cell: ({ row }) => {
  //     const margin2 = row.getValue("closePriceAvg") as number;
  //     const margin1 = row.getValue("openPriceAvg") as number;
  //     const size = row.getValue("openSize") as number;
  //     var margin = size*(margin2 - margin1);
  //     if (row.getValue("posSide")=="short") {
  //       margin = -margin;
  //     }
  //     const marginFormatted = margin.toFixed(2);
  //     const textColor = margin >= 0 ? "text-green-500" : "text-red-500";
  //     const formattedMarginAmount = margin >= 0 ? `+${marginFormatted}` : marginFormatted;

  //     return (
  //       <div className="w-5 whitespace-nowrap">
  //         <span className={textColor}>{formattedMarginAmount}</span> USDT
  //       </div>
  //     )
  //   },
  //   // enableSorting: false,
  // },
  // {
  //   accessorKey: "trackingNo",
  //   // header: ({ column }) => (
  //   //       <DataTableColumnHeader column={column} title="trackingNo" />
  //   //     ),
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         订单编号
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue("trackingNo")}</div>
  //   ),
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const datarow = row.original

      return (
        <>
        <div className="flex items-center">
          <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(datarow.traderId)}`} className="px-1">
            <Icons.fileBarChart />
          </Link>
          {/* <Button className="h-7 px-2">
            Copy Trade
          </Button> */}
          <CopyTradeDialog traderId={datarow.traderId} name={datarow.traderName} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <Link
                href={`/analysis?bitgetTraderId=${encodeURIComponent(datarow.traderId)}`}
                target="_blank"
              >
              <DropdownMenuItem>
                  Analysis
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(datarow.traderId)}
            >
              Copy TraderId
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
            {/* <DropdownMenuItem>View datarow details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        </>
      )
    },
  },
]

export const exchangeApiInfoColumns: ColumnDef<ExchangeApiInfo>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "id",
  //   header: "id",
  //   cell: ({ row }) => (
  //     <div>{row.getValue("id")}</div>
  //   ),
  // },
  {
    accessorKey: "accountName",
    header: "AccountName",
    cell: ({ row }) => (
      <div>{row.getValue("accountName")}</div>
    ),
  },
  {
    accessorKey: "exchangeName",
    header: "Exchange",
    cell: ({ row }) => (
      <div>{row.getValue("exchangeName")}</div>
    ),
  },
  {
    accessorKey: "apiKey",
    header: "API",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="ApiKey" />
    // ),
    cell: ({ row }) => (
      <div>{row.getValue("apiKey")}</div>
    ),
  },
  // {
  //   accessorKey: "secretKey",
  //   header: "SecretKey",
  //   cell: ({ row }) => (
  //     <div>{row.getValue("secretKey")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "passphrase",
  //   header: "Passphrase",
  //   cell: ({ row }) => (
  //     <div>{row.getValue("passphrase")}</div>
  //   ),
  // },
  {
    accessorKey: "enabled",
    header: "Enabled",
    cell: ({ row }) => (
      <div>{row.getValue("enabled")}</div>
    ),
  },
  // {
  //   accessorKey: "description",
  //   header: "Description",
  //   cell: ({ row }) => (
  //     <div>{row.getValue("description")}</div>
  //   ),
  // },
  {
    id: "actions",
    enableHiding: false,
    // cell: ({ row }) => {
    cell: function Cell({ row }) {
      const datarow = row.original
      const [showUpdateTaskSheet, setShowUpdateTaskSheet] = useState(false)
      const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false)

      return (
        <>
        <UpdateExchangeApiSheet
          open={showUpdateTaskSheet}
          onOpenChange={setShowUpdateTaskSheet}
          task={row.original}
        />
        <DeleteExchangeApiDialog
          open={showDeleteTaskDialog}
          onOpenChange={setShowDeleteTaskDialog}
          tasks={[row.original]}
          showTrigger={false}
          onSuccess={() => row.toggleSelected(false)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(datarow.apiKey)}
            >
              Copy ApiKey
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </>
      )
    },
  },
]

// export const columns: ColumnDef<Task>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         className="translate-y-[2px]"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className="translate-y-[2px]"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "symbol",
//     header: "symbol",
//     cell: ({ row }) => (
//       <div>{row.getValue("symbol")}</div>
//     ),
//   },
//   {
//     accessorKey: "posSide",
//     header: "posSide",
//     cell: ({ row }) => (
//       <div>{row.getValue("posSide")}</div>
//     ),
//   },
//   {
//     accessorKey: "openPriceAvg",
//     header: "openPriceAvg",
//     cell: ({ row }) => (
//       <div>{row.getValue("openPriceAvg")}</div>
//     ),
//   },
//   {
//     accessorKey: "closePriceAvg",
//     header: "closePriceAvg",
//     cell: ({ row }) => (
//       <div>{row.getValue("closePriceAvg")}</div>
//     ),
//   },
//   {
//     accessorKey: "trackingNo",
//     header: "trackingNo",
//     cell: ({ row }) => (
//       <div className="capitalize">{row.getValue("trackingNo")}</div>
//     ),
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <DataTableRowActions row={row} />,
//   },
// ]