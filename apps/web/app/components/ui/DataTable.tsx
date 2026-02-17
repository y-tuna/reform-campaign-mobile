'use client'

import React, { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table'
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/app/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowSelect?: (selectedRows: TData[]) => void
  searchable?: boolean
  searchPlaceholder?: string
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowSelect,
  searchable = false,
  searchPlaceholder = "검색...",
  className
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
  })

  // Notify parent of selected rows
  React.useEffect(() => {
    if (onRowSelect) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
      onRowSelect(selectedRows)
    }
  }, [rowSelection, onRowSelect, table])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      {searchable && (
        <div className="flex items-center">
          <input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-bg-elevated border border-border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-bg-surface border border-border-muted rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border-muted bg-bg-elevated">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider",
                        header.column.getCanSort() && "cursor-pointer select-none hover:text-text-primary"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <div className="flex flex-col">
                                <ChevronUpIcon 
                                  className={cn(
                                    "h-3 w-3 -mb-1",
                                    header.column.getIsSorted() === 'asc' 
                                      ? "text-blue-400" 
                                      : "text-neutral-500"
                                  )}
                                />
                                <ChevronDownIcon 
                                  className={cn(
                                    "h-3 w-3",
                                    header.column.getIsSorted() === 'desc' 
                                      ? "text-blue-400" 
                                      : "text-neutral-500"
                                  )}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            {/* Body */}
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-border-muted transition-colors hover:bg-white/2",
                      index % 2 === 0 ? "bg-bg-surface" : "bg-bg-surface/50", // Zebra stripes
                      row.getIsSelected() && "bg-blue-500/5 border-blue-500/20"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-text-primary">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-4 py-12 text-center text-neutral-400"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} 행 선택됨
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-neutral-400">
            페이지 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "p-1 rounded border transition-colors",
                table.getCanPreviousPage()
                  ? "border-border-muted hover:bg-white/5 text-text-primary"
                  : "border-border-muted text-neutral-500 cursor-not-allowed"
              )}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                "p-1 rounded border transition-colors",
                table.getCanNextPage()
                  ? "border-border-muted hover:bg-white/5 text-text-primary"
                  : "border-border-muted text-neutral-500 cursor-not-allowed"
              )}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}