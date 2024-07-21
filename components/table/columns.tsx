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
import { Switch } from "../ui/switch"
import { EnabledExchangeApiDialog } from "../exchange/enabled-api-dialog"
import { toggleEnabledExchangeAPI } from "@/actions/exchange"
import { DeleteCopyTradingDialog } from "../exchange/delete-copytrading-dialog"

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
    header: "Position",
    // cell: ({ row }) => (
    //   <div>{row.getValue("symbol")}</div>
    // ),
    cell: function Cell({ row }) {
      const datarow = row.original

      return (
        <div className="flex flex-col">
          <div className="max-w-xs truncate font-semibold">
            {datarow.symbol}
          </div>
          <div className="text-gray-500">
            {datarow.posSide}
          </div>
        </div>
      )
    },
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
    cell: ({ row }) => {
      const valueStr = row.getValue("openPriceAvg") as string;
      const truncatedValue = valueStr.length > 9 ? valueStr.substring(0, 9) : valueStr;
      return <div>{truncatedValue} USDT</div>;
    },
  },
  {
    accessorKey: "closePriceAvg",
    header: "ClosePriceAvg",
    cell: ({ row }) => {
      const valueStr = row.getValue("closePriceAvg") as string;
      const truncatedValue = valueStr.length > 9 ? valueStr.substring(0, 9) : valueStr;
      return <div>{truncatedValue} USDT</div>;
    },
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
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View datarow details</DropdownMenuItem> */}
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
    header: "Trader",
    cell: ({ row }) => {
      const datarow = row.original
      
      return (
        // <div>{row.getValue("traderName")}</div>
        <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(datarow["traderId"])}`}>
          {datarow["traderName"]}
        </Link>
      )
    },
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
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      // const userApi = useUserApi(); // 使用 useUserApi 钩子
      const datarow = row.original

      return (
        <>
        <div className="flex items-center">
          <CopyTradeDialog traderId={datarow.traderId} traderName={datarow.traderName} userApi={datarow.userApi} />
          <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(datarow.traderId)}`} >
            <Icons.fileBarChart />
          </Link>
          {/* <Link href={`/ct/setting/${datarow.traderId}`} className="px-1">
            <Button className="h-7 px-2">
              Copy Trade
            </Button>
          </Link> */}
          {/* <CopyTradeDialog traderId={datarow.traderId} name={datarow.traderName} /> */}

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
          </DropdownMenuContent>
        </DropdownMenu> */}
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
  // {
  //   accessorKey: "accountName",
  //   header: "Account Name",
  //   cell: ({ row }) => (
  //     <div>{row.getValue("accountName")}</div>
  //   ),
  // },  
  {
    header: "Exchange",
    cell: function Cell({ row }) {
      const datarow = row.original

      return (
        <div className="flex flex-col">
          <div className="max-w-xs truncate font-bold">
            {datarow.accountName}
          </div>
          <div className="text-gray-500">
            {datarow.exchangeName}
          </div>
        </div>
      )
    },
  },
  // {
  //   accessorKey: "exchangeName",
  //   header: "Exchange",
  //   cell: ({ row }) => (
  //     <div>{row.getValue("exchangeName")}</div>
  //   ),
  // },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue("balance");
      return <div>{balance ? `${balance} USDT` : null}</div>;
    },
  },
  {
    accessorKey: "apiKey",
    header: "API",
    // header: ({ column }) => (
    //   <DataTableColumnHeader column={column} title="ApiKey" />
    // ),
    cell: ({ row }) => {
      const apiKey = row.getValue("apiKey") as string;
      const displayApiKey = apiKey.length > 20
        ? `${apiKey.slice(0, 10)}...${apiKey.slice(-10)}`
        : apiKey;
      return <div>{displayApiKey}</div>;
    },
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
    // accessorKey: "enabled",
    header: "Enabled",
    cell: function Cell({ row }) {
      const datarow = row.original
      const [showEnabledApiDialog, setShowEnabledApiDialog] = useState(false)
      const [enabled, setEnabled] = useState<boolean>(datarow.enabled);
      const handleSwitchChange = async () => {
        if (enabled) {
          setShowEnabledApiDialog(true);
          // setEnabled(false);
        } else {
          // enableApi(row);
          const { error } = await toggleEnabledExchangeAPI({
            ids: [datarow.id],
          }, enabled)
          setEnabled(true);
        }
      };
      const handleSuccess = (newState: boolean) => {
        setEnabled(newState); // Update state only on successful action
      };
      return (
        <div>
          <EnabledExchangeApiDialog
            open={showEnabledApiDialog}
            onOpenChange={setShowEnabledApiDialog}
            tasks={[row.original]}
            status={enabled}
            showTrigger={false}
            onSuccess={() => handleSuccess(!enabled)}
          />
          <div className="flex items-center space-x-2">
            {/* <Switch id="api-enabled" defaultChecked={row.getValue("enabled")} onClick={handleSwitchChange}/> */}
            <Switch id="api-enabled" checked={enabled} onClick={handleSwitchChange}/>
          </div>
        </div>
      )
    },
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
    header: "Actions",
    enableHiding: false,
    // cell: ({ row }) => {
    cell: function Cell({ row }) {
      const datarow = row.original
      const [showUpdateTaskSheet, setShowUpdateTaskSheet] = useState(false)
      const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false)

      return (
        <div className="flex items-center space-x-2">
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
        <div className="cursor-pointer" onClick={() => setShowUpdateTaskSheet(true)}>
          <Icons.pencilLine />
        </div>
        <div className="cursor-pointer" onClick={() => setShowDeleteTaskDialog(true)}>
          <Icons.trash2 />
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
        </DropdownMenu> */}
        </div>
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

export type CopyTradingAccountInfo = { 
  copyTradingSettingId: string; 
  exchangeAccountId: string; 
  // copyTradingSetting: any[]; 
  exchangeAccount: ExchangeApiInfo; 
};

export type CopyTradingSettingInfo = {
  // userApi: any[];
  id: string;
  userId: string;
  traderId: string;
  traderName: string;
  fixedAmount: number | null;
  multiplierAmount: number | null;
  followedApis: CopyTradingAccountInfo[];
};

export const copyTradingSettingColumns: ColumnDef<CopyTradingSettingInfo>[] = [
  {
    header: "Trader",
    cell: function Cell({ row }) {
      const datarow = row.original
      return (
        <div className="flex items-center space-x-2">
          {(
            <>{datarow.traderName}</>
          )}
        </div>
      )
    },
  },
  {
    header: "Mode",
    cell: function Cell({ row }) {
      const datarow = row.original
      return (
        <div className="flex items-center space-x-2">
          {datarow.fixedAmount && (
            <>FixedAmount: {datarow.fixedAmount} USDT</>
          )}
          {datarow.multiplierAmount && (
            <>MultiplierAmount: {datarow.multiplierAmount} X</>
          )}
        </div>
      )
    },
  },
  {
    header: "Pnl",
    cell: ({ row }) => {
      // const columnList = row.original.columnList;
      // const pnlItem = columnList[1];
      // const pnlValue = pnlItem ? pnlItem.value : "";
      // return <div>{pnlValue}</div>;
    },
  },
  {
    header: "FollowedApis",
    cell: function Cell({ row }) {
      const datarow = row.original
      return (
        <div className="flex items-center space-x-2">
          {datarow.followedApis.map((api, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>{api.exchangeAccount.accountName}</span>
              {/* <span>{api.apiName}</span> */}
            </div>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const datarow = row.original
      const [showUpdateTaskSheet, setShowUpdateTaskSheet] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)

      return (
        <>
        <div className="flex items-center space-x-2">
          <DeleteCopyTradingDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            tasks={[row.original]}
            showTrigger={false}
            onSuccess={() => row.toggleSelected(false)}
          />
          {/* <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(datarow.traderId)}`} >
            <Icons.fileBarChart />
          </Link> */}
          <div className="cursor-pointer" >
            <Icons.pencilLine />
          </div>
          <div className="cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
            <Icons.trash2 />
          </div>
          {/* <Link href={`/ct/setting/${datarow.traderId}`} className="px-1">
            <Button className="h-7 px-2">
              Copy Trade
            </Button>
          </Link> */}

        </div>
        </>
      )
    },
  },
]