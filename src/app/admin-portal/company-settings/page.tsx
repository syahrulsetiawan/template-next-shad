"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { Form } from 'react-hook-form';

export interface ICompanySettingsProps {
}

export default function Page (props: ICompanySettingsProps) {
  const t = useTranslations('default.CompanySettingsPage');
  return (
    <div>
      <Card>
        <CardHeader>
          <h1 className="text-xl text-foreground font-semibold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </CardHeader>
        <CardContent>
          {/* <Form /> */}
          <div className="form">
            {/* <Form> */}
              <form className="w-max-md border">
              </form>
            {/* </Form> */}
          </div>
          {/* <Form /> */}
        </CardContent>
      </Card>
    </div>
  );
}
