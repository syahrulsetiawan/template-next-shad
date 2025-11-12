'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EllipsisVertical,
  Search,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

// -----------------------------------------------------------------------------
// INTERFACE
// -----------------------------------------------------------------------------
export interface actionProps {
  label: string
  color?: 'default' | 'primary' | 'secondary' | 'warning' | 'success' | 'danger'
  icon?: React.ReactNode
  disabled?: boolean
  onClick: () => void
}

interface MySimpleDataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  withSearch?: boolean
  withPagination?: boolean
  searchColumnKey?: keyof TData
  filter?: React.ReactNode
  withAction?: boolean
  actions?: actionProps[]

  // ---- External handlers
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onSearch?: (keyword: string) => void
  onPageChange?: (pageIndex: number) => void

  // ---- Controlled states
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  pageIndex?: number
  pageCount?: number
  isLoading?: boolean
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
  filter,
  withAction = false,
  actions,
  onSortChange,
  onSearch,
  onPageChange,
  sortBy,
  sortOrder,
  pageIndex = 0,
  pageCount = 1,
  isLoading = false,
}: MySimpleDataTableProps<TData, TValue>) {
  const [keyword, setKeyword] = React.useState('')

  // ---------------------------------------------------------------------------
  // Utility: cek apakah kolom punya accessorKey
  // ---------------------------------------------------------------------------
  const hasAccessorKey = (
    col: ColumnDef<TData, TValue>
  ): col is ColumnDef<TData, TValue> & { accessorKey: string } =>
    'accessorKey' in col && typeof (col as any).accessorKey === 'string'

  // ---------------------------------------------------------------------------
  // Inject tombol sorting di header kolom
  // ---------------------------------------------------------------------------
  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    return initialColumns.map((col) => {
      const isSortable = hasAccessorKey(col) || !!col.id

      if (isSortable && typeof col.header === 'string') {
        const headerText = col.header

        return {
          ...col,
          id: col.id ?? (hasAccessorKey(col) ? col.accessorKey : headerText),
          header: () => {
            const sortKey = hasAccessorKey(col)
              ? col.accessorKey
              : (col.id ?? headerText)

            const isActive = sortBy === sortKey
            const SortIcon =
              isActive && sortOrder === 'asc'
                ? ChevronUp
                : isActive && sortOrder === 'desc'
                ? ChevronDown
                : ChevronsUpDown

            return (
              <Button
                variant="ghost"
                onClick={() => {
                  const newOrder =
                    sortBy === sortKey && sortOrder === 'asc' ? 'desc' : 'asc'
                  onSortChange?.(sortKey, newOrder)
                }}
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
  }, [initialColumns, sortBy, sortOrder, onSortChange])

  // ---------------------------------------------------------------------------
  // Inisialisasi React Table (tanpa sorting/pagination internal)
  // ---------------------------------------------------------------------------
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // ---------------------------------------------------------------------------
  // Event: Search Input
  // ---------------------------------------------------------------------------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeyword(value)
    onSearch?.(value)
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full">
      {/* Search Input */}
      {withSearch && (
        <div className="w-full flex items-center justify-start gap-2 mb-2">
          {filter && filter}
          <InputGroup className="w-[200px]">
            <InputGroupInput
              placeholder="Search..."
              maxLength={30}
              value={keyword}
              onChange={handleSearchChange}
            />
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

                {/* action header */}
                {withAction && (
                  <TableHead className="w-12 text-center"></TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body */}
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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

                  {/* action cell */}
                  {withAction && (
                    <TableCell className="w-12 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={'ghost'} size={'icon'}>
                            <EllipsisVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions?.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={action.onClick}
                              className={cn(
                                action.color === 'primary' &&
                                  'text-primary cursor-pointer',
                                action.disabled &&
                                  'text-muted-foreground cursor-not-allowed',
                                action.color === 'warning' &&
                                  'text-warning cursor-pointer',
                                action.color === 'success' &&
                                  'text-success cursor-pointer',
                                action.color === 'danger' &&
                                  'text-destructive focus:bg-destructive focus:text-foreground cursor-pointer'
                              )}
                              disabled={action.disabled}
                            >
                              {action.icon && (
                                <span className="mr-1 inline-flex">
                                  {action.icon}
                                </span>
                              )}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
            Halaman {pageIndex + 1} dari {pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pageIndex - 1)}
            disabled={pageIndex <= 0}
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(pageIndex + 1)}
            disabled={pageIndex + 1 >= pageCount}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  )
}
