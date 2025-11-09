'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Box, CircleX, Layers, Search, SearchIcon, Truck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface ISearchPanelProps {}

export default function SearchPanel(props: ISearchPanelProps) {
  const [keyword, setKeyword] = React.useState('');
  const [pendingKeyword, setPendingKeyword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  const [tooltip, setTooltip] = React.useState<string[]>([
    'logistic',
    'product',
    'supply chain',
    'warehouse',
    'inventory',
    'shipping',
    'transportation',
  ]);

  const [historySearch, setHistorySearch] = React.useState<
    {
      keyword: string;
      date: string;
      description: string;
      module: string;
      icon: React.ElementType;
    }[]
  >([
    {
      keyword: 'PO.25.000124',
      date: '2023-10-01 12:04:23',
      description: 'Search for Purchase Order 25.000124',
      module: 'Logistics',
      icon: Box,
    },
    {
      keyword: 'DO.25.000323',
      date: '2023-09-30 12:04:23',
      description: 'Search for Delivery Order 25.000323',
      module: 'Shipping',
      icon: Truck,
    },
    {
      keyword: 'INV.BATCH.PNCL.25.00392',
      date: '2023-10-01 12:04:23',
      description: 'Search for supply chain related terms',
      module: 'Supply Chain',
      icon: Layers,
    },
  ]);

  const handleSearch = React.useCallback(() => {
    console.log('Searching for:', keyword);
    setIsLoading(false);
  }, [keyword]);

  // 🔁 Debounce logic for search input
  React.useEffect(() => {
    if (!pendingKeyword) return;
    setIsLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setKeyword(pendingKeyword);
      handleSearch();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pendingKeyword, handleSearch]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Input className='hidden md:block' placeholder="Search Something" type="text" readOnly />
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] md:max-w-[680px] min-h-[425px]">
          <DialogHeader>
            <DialogTitle>Search Something</DialogTitle>
            <DialogDescription>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search size={16} />
                </span>
                <Input
                  placeholder="Search Something"
                  type="text"
                  className="pl-9"
                  onChange={(e) => setPendingKeyword(e.target.value)}
                />
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* 🔍 Content */}
          <div className="dialog-content block max-h-[360px] overflow-y-auto">
            {/* Loading state */}
            {isLoading &&
            ((pendingKeyword && pendingKeyword.trim() !== '' && pendingKeyword !== null && pendingKeyword !== undefined) ||
              (keyword && keyword.trim() !== '')) ? (
              <div className="flex flex-col gap-4 mt-4">
                <Skeleton className="h-6 w-32 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            ) : keyword.trim() === '' ? (
              // 🏷️ Default content (suggestions + history)
              <div>
                {/* Suggestions */}
                <span className="text-xs text-muted-foreground">Searching for</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tooltip.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm"
                    >
                      {item}
                      <CircleX
                        className="ml-1 w-4 h-4 cursor-pointer text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setTooltip((prev) => prev.filter((_, i) => i !== index))
                        }
                      />
                    </span>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* History */}
                <span className="text-xs text-muted-foreground">Last Search</span>
                <div className="mt-2">
                  {historySearch.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-2 hover:bg-secondary rounded-md cursor-pointer"
                    >
                      <div className="flex items-center gap-4 p-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <item.icon className="w-5 h-5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>{item.module}</TooltipContent>
                        </Tooltip>

                        <div>
                          <div className="text-sm font-medium">{item.keyword}</div>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>

                      <CircleX
                        className="w-4 h-4 text-muted-foreground hover:text-destructive cursor-pointer"
                        onClick={() =>
                          setHistorySearch((prev) => prev.filter((_, i) => i !== index))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // 🔎 Search result placeholder
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Search className="w-10 h-10 mb-4 text-muted-foreground" />
                <div className="text-lg font-semibold">Hasil untuk “{keyword}”</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Tampilkan hasil pencarian di sini...
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
