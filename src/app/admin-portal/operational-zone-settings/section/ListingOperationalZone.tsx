'use client'

import { MySimpleDataTable } from '@/components/table/MySimpleDataTable'
import { userColumns } from './ListingColumn'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Filter } from 'lucide-react'

export default function ListingOperationalZone() {
  const data = [
    { id: 1, name: 'Budi', email: 'budi@mail.com', role: 'Admin' },
    { id: 2, name: 'Siti', email: 'siti@mail.com', role: 'Staff' },
    { id: 3, name: 'Rudi', email: 'rudi@mail.com', role: 'Manager' },
  ]

  return (
    <div className="p-6 space-y-6">
      <MySimpleDataTable
        data={data}
        columns={userColumns}
        withSearch
        withPagination
        searchColumnKey="name"
        filter={
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={'ghost'} size={'sm'}>
                  <Filter className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        }
      />
    </div>
  )
}
