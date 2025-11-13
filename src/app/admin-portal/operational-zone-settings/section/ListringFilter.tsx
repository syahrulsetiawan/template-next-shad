import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Filter} from 'lucide-react';
import {Separator} from '@/components/ui/separator';

export function ListingFilter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'outline'} size={'icon'}>
          <Filter size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-sm p-4" align="start">
        <div className="">
          <div className="mb-4 space-y-2">
            <Label htmlFor="category">Status</Label>
            <Input id="category" placeholder="Misal: pakan, obat..." />
          </div>

          <Separator className="my-2" />
          <div className="flex justify-between">
            <Button variant="secondary" size="sm">
              Clear All
            </Button>
            <Button variant="default" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
