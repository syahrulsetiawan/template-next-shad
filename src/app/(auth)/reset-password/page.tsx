'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import * as z from 'zod'; // ✅ perbaikan import zod
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import LogoLight from '@/components/image/LogoLight';
import LogoDark from '@/components/image/LogoDark';
import React from 'react';

export default function ResetPasswordPage() {
  const { theme } = useTheme();
  const t = useTranslations('ResetPasswordPage');
  const e = useTranslations('errorResponse');
  const v = useTranslations('common.validation');

  // ✅ definisi schema validasi
  const resetPasswordFormSchema = z
    .object({
      password: z
        .string({ required_error: v('required', { field: 'form.password.label' }) })
        .min(6, { message: v('minLength', { min: '6' }) })
        .max(50, { message: v('maxLength', { max: '50' }) }),
      password_confirmation: z
        .string({ required_error: v('required', { field: 'form.password_confirmation.label' }) })
        .min(6, { message: v('minLength', { min: '6' }) })
        .max(50, { message: v('maxLength', { max: '50' }) }),
    })
    // ✅ refine diletakkan di luar untuk akses langsung ke kedua field
    .refine((data) => data.password === data.password_confirmation, {
      message: v('invalidPasswordConfirmation'),
      path: ['password_confirmation'],
    });

  type IResetPasswordSchema = z.infer<typeof resetPasswordFormSchema>;

  const form = useForm<IResetPasswordSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const handleFormSubmit = async (data: IResetPasswordSchema) => {
    console.log('Reset password form data:', data);
    // TODO: implementasi submit API reset password
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
            <p className="text-muted-foreground mt-4 text-center">{t('description')}</p>
            <Form {...form}>
              <form className="py-2 mt-4" onSubmit={form.handleSubmit(handleFormSubmit)}>
                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.password.label')}</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="password" // ✅ ubah jadi password
                            placeholder={t('form.password.placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('form.password_confirmation.label')}</FormLabel>
                        <FormControl>
                          <Input
                            required
                            type="password" // ✅ ubah jadi password
                            placeholder={t('form.password_confirmation.placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
