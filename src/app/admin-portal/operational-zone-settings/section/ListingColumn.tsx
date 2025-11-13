import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

type User = {
  id: number
  name: string
  code: string
  country: string
  province: string
  status?: string
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
    accessorKey: 'code',
    header: 'Code',
    meta: { align: 'left' },
  },
  {
    accessorKey: 'country',
    header: 'Negara',
    meta: { align: 'center' },
  },
  {
    accessorKey: 'province',
    header: 'Provinsi',
    meta: { align: 'left' },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: { align: 'center' },
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      
      // Tentukan variant badge berdasarkan status
      const color = status === 'active' ? 'bg-teal-800 text-foreground' : 
                    status === 'inactive' ? 'bg-destructive text-foreground' : 
                    '' 
      
      return (
        <Badge variant='default' className={color + " capitalize"}>
          {status}
        </Badge>
      )
    },
  },
]
