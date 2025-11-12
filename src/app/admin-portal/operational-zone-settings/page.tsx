'use client';
import MyFullLoadingPage from '@/components/layout/MyFullLoadingPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLoading } from '@/hooks/useLoading';
import { ArrowRight, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import ListingOperationalZone from './section/ListingOperationalZone';

export interface IPageProps {
}

export default function Page(props: IPageProps) {
  const {isLoading} = useLoading();
  const t = useTranslations('default.OperationalZonePage');
  const [isOpernDetail, SetIsOpenDetail] = React.useState(false);

  const toggleOpenDetail = () => {
    console.log("Ini di hit")
    SetIsOpenDetail(!isOpernDetail);
  }

  return (
    <div className=''>
      <MyFullLoadingPage isLoading={isLoading} />
      <div className="w-full p-2 md:p-8">
        <div className="mb-8 block sm:flex items-center justify-between">
          <div className="title-page w-full sm:w-2/4 mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-foreground">{t('title') || 'Pengaturan Perusahaan'}</h1>
            <p className="text-sm text-muted-foreground">
              {t('description') || 'Kelola informasi dasar dan alamat perusahaan Anda.'}
            </p>
          </div>
          <div className="action-page w-full sm:w-2/4 flex justify-start sm:justify-end gap-2 mb-4 sm:mb-0">
            <Button>
              Import
            </Button>
            <Button className='buttonadd'>
              <Plus />
              Create Data
            </Button>
          </div>
        </div>
        <ListingOperationalZone />
        
      </div>
    </div>
  );
}
