'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

// -----------------------------------------------------------------------------
// INTERFACE
// -----------------------------------------------------------------------------
interface MySimpleDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  withSearch?: boolean
  withPagination?: boolean
  searchColumnKey?: keyof TData
  filter?: React.ReactNode
}

// -----------------------------------------------------------------------------
// KOMPONEN UTAMA
// -----------------------------------------------------------------------------
export function MySimpleDataTable<TData, TValue>({
  data,
  columns: initialColumns,
  withSearch = false,
  withPagination = false,
  searchColumnKey = 'name' as keyof TData,
  filter
}: MySimpleDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  // ---------------------------------------------------------------------------
  // Utility: cek apakah kolom punya accessorKey
  // ---------------------------------------------------------------------------
  const hasAccessorKey = (
    col: ColumnDef<TData, TValue>
  ): col is ColumnDef<TData, TValue> & { accessorKey: string } =>
    'accessorKey' in col && typeof (col as any).accessorKey === 'string'

  // ---------------------------------------------------------------------------
  // Tambahkan ikon sorting di header kolom
  // ---------------------------------------------------------------------------
  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    return initialColumns.map((col) => {
      const isSortable = hasAccessorKey(col) || !!col.id

      // Kalau header-nya string → buatkan tombol sorting otomatis
      if (isSortable && typeof col.header === 'string') {
        const headerText = col.header

        return {
          ...col,
          id: col.id ?? (hasAccessorKey(col) ? col.accessorKey : headerText),
          header: ({ column }) => {
            const canSort = column.getCanSort()
            const sortedState = column.getIsSorted()
            const SortIcon =
              sortedState === 'asc'
                ? ChevronUp
                : sortedState === 'desc'
                ? ChevronDown
                : ChevronsUpDown

            if (!canSort) return <div className="font-semibold">{headerText}</div>

            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === 'asc', true)
                }
                className="p-2 h-auto font-semibold"
              >
                {headerText}
                <SortIcon className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        } as ColumnDef<TData, TValue>
      }

      return col
    })
  }, [initialColumns])

  // ---------------------------------------------------------------------------
  // Inisialisasi tabel
  // ---------------------------------------------------------------------------
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    ...(withPagination && { getPaginationRowModel: getPaginationRowModel() }),
    state: { sorting, globalFilter },
  })

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full">
      {/* Search Input */}
      {withSearch && (
        <div className="w-full flex items-center justify-end gap-2 mb-2">
          { filter && (filter) }
          <InputGroup className='w-[200px]'>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}

      

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          {/* Header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      header.column.columnDef.meta?.align === 'center' &&
                        'text-center',
                      header.column.columnDef.meta?.align === 'right' &&
                        'text-right'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.align === 'center' &&
                          'text-center',
                        cell.column.columnDef.meta?.align === 'right' &&
                          'text-right'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {withPagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Halaman {table.getState().pagination.pageIndex + 1} dari{' '}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  )
}
