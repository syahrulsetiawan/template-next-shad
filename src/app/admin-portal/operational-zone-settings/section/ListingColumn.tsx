import { ColumnDef } from '@tanstack/react-table'

type User = {
  id: number
  name: string
  email: string
  role: string
}

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { align: 'center' }, // custom meta buat alignment
  },
  {
    accessorKey: 'name',
    header: 'Nama',
    meta: { align: 'left' },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: { align: 'left' },
  },
  {
    accessorKey: 'role',
    header: 'Peran',
    meta: { align: 'center' },
  },
  {
    accessorKey: 'name',
    header: 'Nama',
    meta: { align: 'left' },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    meta: { align: 'left' },
  },
  {
    accessorKey: 'role',
    header: 'Peran',
    meta: { align: 'center' },
  },
]
