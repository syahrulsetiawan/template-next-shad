'use client'

import { actionProps, MySimpleDataTable } from '@/components/table/MySimpleDataTable'
import { userColumns } from './ListingColumn'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Filter, Pencil, Trash } from 'lucide-react'
import { ListingFilter } from './ListringFilter'


const actions: actionProps[] = [
  {
    label: 'Edit',
    color: 'primary',
    icon: <Pencil size={14} />,
    onClick: () => { console.log('Edit clicked') }
  },
  {
    label: 'Secondary',
    color: 'secondary',
    disabled: true,
    onClick: () => { console.log('Edit clicked') }
  },
  {
    label: 'Delete',
    color: 'danger',
    icon: <Trash size={14} />,
    onClick: () => { console.log('Delete clicked') }
  }
]

export default function ListingOperationalZone() {
  const data = [
    { id: 1, name: 'Jawa Barat', code: 'B001', country: 'Indonesia', province: 'Jawa Barat', status: 'active' },
    { id: 2, name: 'Jawa Tengah', code: 'S002', country: 'Indonesia', province: 'Jawa Tengah', status: 'inactive' },
    { id: 3, name: 'Jawa Timur', code: 'R003', country: 'Indonesia', province: 'Jawa Timur', status: 'pending' },
  ]

  return (
    <div className="space-y-4">
      <MySimpleDataTable
        data={data}
        columns={userColumns}
        withSearch
        withPagination
        searchColumnKey="name"
        filter={
            <ListingFilter />
        }
        withAction
        actions={actions}
      />
    </div>
  )
}
