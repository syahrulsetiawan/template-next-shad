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
    { id: 1, name: 'Budi', email: 'budi@mail.com', role: 'Admin' },
    { id: 2, name: 'Siti', email: 'siti@mail.com', role: 'Staff' },
    { id: 3, name: 'Rudi', email: 'rudi@mail.com', role: 'Manager' },
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
