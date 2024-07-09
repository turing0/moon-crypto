"use client"

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFilterField } from "@/types"

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* <Input
          placeholder="Filter symbol..."
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        /> */}
        {/* {table.getColumn("posSide") && (
          <DataTableFacetedFilter
            column={table.getColumn("posSide")}
            title="posSide"
            options={statuses}
          />
        )} */}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}

// export function DataTableToolbar<TData>({
//   table,
//   filterFields = [],
//   children,
//   className,
//   ...props
// }: DataTableToolbarProps<TData>) {
//   const isFiltered = table.getState().columnFilters.length > 0

//   // Memoize computation of searchableColumns and filterableColumns
//   const { searchableColumns, filterableColumns } = React.useMemo(() => {
//     return {
//       searchableColumns: filterFields.filter((field) => !field.options),
//       filterableColumns: filterFields.filter((field) => field.options),
//     }
//   }, [filterFields])

//   return (
//     <div
//       className={cn(
//         "flex w-full items-center justify-between space-x-2 overflow-auto p-1",
//         className
//       )}
//       {...props}
//     >
//       <div className="flex flex-1 items-center space-x-2">
//         {searchableColumns.length > 0 &&
//           searchableColumns.map(
//             (column) =>
//               table.getColumn(column.value ? String(column.value) : "") && (
//                 <Input
//                   key={String(column.value)}
//                   placeholder={column.placeholder}
//                   value={
//                     (table
//                       .getColumn(String(column.value))
//                       ?.getFilterValue() as string) ?? ""
//                   }
//                   onChange={(event) =>
//                     table
//                       .getColumn(String(column.value))
//                       ?.setFilterValue(event.target.value)
//                   }
//                   className="h-8 w-40 lg:w-64"
//                 />
//               )
//           )}
//         {filterableColumns.length > 0 &&
//           filterableColumns.map(
//             (column) =>
//               table.getColumn(column.value ? String(column.value) : "") && (
//                 <DataTableFacetedFilter
//                   key={String(column.value)}
//                   column={table.getColumn(
//                     column.value ? String(column.value) : ""
//                   )}
//                   title={column.label}
//                   options={column.options ?? []}
//                 />
//               )
//           )}
//         {isFiltered && (
//           <Button
//             aria-label="Reset filters"
//             variant="ghost"
//             className="h-8 px-2 lg:px-3"
//             onClick={() => table.resetColumnFilters()}
//           >
//             Reset
//             <Cross2Icon className="ml-2 size-4" aria-hidden="true" />
//           </Button>
//         )}
//       </div>
//       <div className="flex items-center gap-2">
//         {children}
//         <DataTableViewOptions table={table} />
//       </div>
//     </div>
//   )
// }
