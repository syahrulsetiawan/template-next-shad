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
        <div className="mb-4 flex items-center justify-between">
          <div className="title-page">
            <h1 className="text-2xl font-bold text-foreground">{t('title') || 'Pengaturan Perusahaan'}</h1>
            <p className="text-sm text-muted-foreground">
              {t('description') || 'Kelola informasi dasar dan alamat perusahaan Anda.'}
            </p>
          </div>
          <div className="action-page">
            <Button className='buttonadd'>
              <Plus />
              Create New Data
            </Button>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <div>
            <Card>
              <CardHeader>
                <h3 className='font-semibold text-foreground'>List Operational Zone</h3>
                <p className="text-sm text-muted-foreground">
                  All active Operational Zone
                </p>
              </CardHeader>
              <CardContent>
                {/* <Table>
                  <TableHeader>
                    <TableRow className='bg-muted hover:bg-muted'>
                      <TableHead className="font-medium">Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className='cursor-pointer'>
                      <TableCell className="font-medium">Jawa Barat</TableCell>
                      <TableCell>JB</TableCell>
                      <TableCell>Indonesia</TableCell>
                      <TableCell>West Java</TableCell>
                      <TableCell>
                        <ArrowRight size={14} />
                      </TableCell>
                    </TableRow>
                    <TableRow className='cursor-pointer'>
                      <TableCell className="font-medium">Jawa Timur</TableCell>
                      <TableCell>JT</TableCell>
                      <TableCell>Indonesia</TableCell>
                      <TableCell>East Java</TableCell>
                      <TableCell>
                        <ArrowRight size={14} />
                      </TableCell>
                    </TableRow>
                    <TableRow className='cursor-pointer'>
                      <TableCell className="font-medium">Bali</TableCell>
                      <TableCell>Bali</TableCell>
                      <TableCell>Indonesia</TableCell>
                      <TableCell>Bali</TableCell>
                      <TableCell>
                        <ArrowRight size={14} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table> */}

                <ListingOperationalZone />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold">Detail Zona Wilayah</h2>
              </CardHeader>
              <CardContent>
                <p>Please wait while we load the data.</p>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
