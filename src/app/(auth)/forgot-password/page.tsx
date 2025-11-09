'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import * as z from 'zod'; // ✅ perbaikan import
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import LogoLight from '@/components/image/LogoLight';
import LogoDark from '@/components/image/LogoDark';
import React from 'react';

export default function ForgotPasswordPage() {
  const { theme } = useTheme();
  const t = useTranslations('ForgotPasswordPage');
  const e = useTranslations('errorResponse');
  const v = useTranslations('common.validation');

  // ✅ Schema validasi form
  const forgotPasswordFormSchema = z.object({
    email: z
      .string({ required_error: v('required', { field: 'email' }) })
      .email(v('email'))
      .min(6, { message: v('minLength', { min: '6' }) })
      .max(50, { message: v('maxLength', { max: '50' }) }),
  });

  type IForgotPasswordSchema = z.infer<typeof forgotPasswordFormSchema>;

  const form = useForm<IForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: IForgotPasswordSchema) => {
    console.log('Forgot password data:', data);
    // TODO: implementasi API forgot password
  };

  return (
    <div className="relative">
      <div className="w-screen h-screen flex items-center justify-center p-3">
        <Card className="w-full md:w-[480px]">
          <CardHeader>
            <div className="flex flex-col items-center gap-5 my-2">
              {theme === 'light' ? <LogoLight /> : <LogoDark />}
              <h2 className="text-2xl font-bold">{t('title')}</h2>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mt-4">{t('description')}</p>

            <Form {...form}>
              <form className="py-2 mt-4" onSubmit={form.handleSubmit(handleFormSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.email.label')}</FormLabel>
                      <FormControl>
                        <Input
                          required
                          type="email" // ✅ ubah jadi email
                          placeholder={t('form.email.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="mt-3 w-full" type="submit">
                  {t('form.submit')}
                </Button>

                <Separator className="my-4" />

                <div className="flex items-center justify-center">
                  <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                    {t('backToLogin')}
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
