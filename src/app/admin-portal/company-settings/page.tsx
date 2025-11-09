'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Building, MapPin, Settings } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/form/ImageUploader';
import { useLoading } from '@/hooks/useLoading';
import MyFullLoadingPage from '@/components/layout/MyFullLoadingPage';

export interface ICompanySettingsProps {}

const currencyFormatOptions = [
  { value: '#,###,###', label: '9,999,999' },
  { value: '#.###.###', label: '9.999.999' },
] as const;

const dateFormatOptions = [
  { value: 'd/m/Y', label: '31/12/2023' },
  { value: 'm/d/Y', label: '12/31/2023' },
  { value: 'Y/m/d', label: '2023/12/31' },
  { value: 'Y-d-m', label: '2023-31-12' },
  { value: 'Y-m-d', label: '2023-12-31' },
  { value: 'd-m-Y', label: '31-12-2023' },
  { value: 'm-d-Y', label: '12-31-2023' },
  { value: 'Y F d', label: '2023 Desember 31' },
  { value: 'd F Y', label: '31 Desember 2023' },
  { value: 'F d, Y', label: 'Desember 31, 2023' },
] as const;

export default function CompanySettingsPage({}: ICompanySettingsProps) {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const t = useTranslations('default.CompanySettingsPage');
  const v = useTranslations('common.validation');

  const dateValues = dateFormatOptions.map((opt) => opt.value);
  const currencyValues = currencyFormatOptions.map((opt) => opt.value);

  const companySettingsSchema = z.object({
    company_name: z.string().min(1, { message: v('required', { field: t('form.companyName.label') || 'Nama Perusahaan' }) }),
    company_address: z.string().min(1, { message: v('required', { field: t('form.companyAddress.label') || 'Alamat' }) }),
    company_photo: z.string().optional(),
    company_phone: z.string().min(1, { message: v('required', { field: t('form.companyPhone.label') || 'Telepon' }) }),
    company_email: z.string().email({ message: v('email', { field: t('form.companyEmail.label') || 'Email' }) }),
    company_website: z
      .string()
      .url({ message: v('url', { field: t('form.companyWebsite.label') || 'Website' }) })
      .or(z.literal('')), // boleh kosong
    company_tax_number: z.string().min(1, { message: v('required', { field: t('form.companyTaxNumber.label') || 'Nomor Pajak' }) }),
    company_country: z.string().min(1, { message: v('required', { field: t('form.companyCountry.label') || 'Negara' }) }),
    company_province: z.string().min(1, { message: v('required', { field: t('form.companyProvince.label') || 'Provinsi' }) }),
    company_city: z.string().min(1, { message: v('required', { field: t('form.companyCity.label') || 'Kota' }) }),
    company_postal_code: z.string().min(1, { message: v('required', { field: t('form.companyPostalCode.label') || 'Kode Pos' }) }),
    config_dateformat: z.enum(dateValues as [string, ...string[]], { message: v('enum') }),
    config_currencyformat: z.enum(currencyValues as [string, ...string[]], { message: v('enum') }),
  });

  type ICompanySettingsSchema = z.infer<typeof companySettingsSchema>;

  const form = useForm<ICompanySettingsSchema>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      company_name: '',
      company_address: '',
      company_photo: '',
      company_phone: '',
      company_email: '',
      company_website: '',
      company_tax_number: '',
      company_country: '',
      company_province: '',
      company_city: '',
      company_postal_code: '',
      config_dateformat: 'd F Y',
      config_currencyformat: '#.###.###',
    },
  });

  const handleSubmit = async (data: ICompanySettingsSchema) => {
    startLoading();
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log('Submitted data:', data);
        alert('Pengaturan berhasil disimpan!');
        stopLoading();
        resolve();
      }, 1000)
    );
  };

  const handleImageFileChange = (file: File | null) => {
    form.setValue('company_photo', file ? URL.createObjectURL(file) : '');
    form.trigger('company_photo');
  };

  React.useEffect(() => {
    startLoading();
    const timer = setTimeout(() => stopLoading(), 1000);
    return () => clearTimeout(timer);
  }, [startLoading, stopLoading]);

  const renderInputField = (
    name: keyof ICompanySettingsSchema,
    label: string,
    placeholder: string,
    type: string = 'text'
  ) => (
    <div className="mb-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {name === 'company_address' ? (
                <Textarea placeholder={placeholder} className="resize-none" {...field} />
              ) : (
                <Input type={type} placeholder={placeholder} {...field} />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="w-full p-2 md:p-8">
      <MyFullLoadingPage isLoading={isLoading} />
      <Card className="w-full">
        <CardHeader>
          <h1 className="text-2xl font-bold text-foreground">{t('title') || 'Pengaturan Perusahaan'}</h1>
          <p className="text-sm text-muted-foreground">
            {t('description') || 'Kelola informasi dasar dan alamat perusahaan Anda.'}
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                {/* --- INFORMASI PERUSAHAAN --- */}
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building width={16} />
                      {t('companyInformation') || 'Informasi Perusahaan'}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="block md:grid grid-cols-2 gap-6 p-2">
                      {renderInputField('company_name', t('form.companyName.label') || 'Nama Perusahaan', t('form.companyName.placeholder') || 'Masukkan nama perusahaan')}
                      {renderInputField('company_tax_number', t('form.companyTaxNumber.label') || 'Nomor Pajak', t('form.companyTaxNumber.placeholder') || 'Masukkan NPWP')}
                      {renderInputField('company_email', t('form.companyEmail.label') || 'Email', t('form.companyEmail.placeholder') || 'Masukkan email', 'email')}
                      {renderInputField('company_phone', t('form.companyPhone.label') || 'Telepon', t('form.companyPhone.placeholder') || 'Masukkan nomor telepon', 'tel')}
                      {renderInputField('company_website', t('form.companyWebsite.label') || 'Website', t('form.companyWebsite.placeholder') || 'https://www.website.com')}

                      <FormField
                        control={form.control}
                        name="company_photo"
                        render={() => (
                          <FormItem>
                            <FormControl>
                              <ImageUploader
                                label={t('form.companyLogo.label') || 'Logo Perusahaan'}
                                onFileChange={handleImageFileChange}
                                className="mb-6"
                                initialImage={form.getValues('company_photo')}
                                accept=".jpg, .jpeg, .png"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* --- ALAMAT PERUSAHAAN --- */}
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin width={16} />
                      {t('companyAddress') || 'Alamat Perusahaan'}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="block md:grid grid-cols-2 gap-6 p-2">
                      <div className="md:col-span-2">
                        {renderInputField('company_address', t('form.companyAddress.label') || 'Alamat', t('form.companyAddress.placeholder') || 'Masukkan alamat lengkap')}
                      </div>
                      {renderInputField('company_country', t('form.companyCountry.label') || 'Negara', t('form.companyCountry.placeholder') || 'Contoh: Indonesia')}
                      {renderInputField('company_province', t('form.companyProvince.label') || 'Provinsi', t('form.companyProvince.placeholder') || 'Contoh: DKI Jakarta')}
                      {renderInputField('company_city', t('form.companyCity.label') || 'Kota', t('form.companyCity.placeholder') || 'Contoh: Jakarta Selatan')}
                      {renderInputField('company_postal_code', t('form.companyPostalCode.label') || 'Kode Pos', t('form.companyPostalCode.placeholder') || 'Contoh: 12190')}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* --- KONFIGURASI --- */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Settings width={16} />
                      {t('configuration') || 'Konfigurasi Umum'}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="block md:grid grid-cols-2 gap-6 p-2">
                      <div className="mb-2">
                        <FormField
                          control={form.control}
                          name="config_dateformat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('form.configDateFormat.label') || 'Format Tanggal'}</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih format tanggal" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Format Tanggal</SelectLabel>
                                      {dateFormatOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mb-2">
                        <FormField
                          control={form.control}
                          name="config_currencyformat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('form.configCurrencyFormat.label') || 'Format Mata Uang'}</FormLabel>
                              <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih format mata uang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Format Mata Uang</SelectLabel>
                                      {currencyFormatOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* --- Tombol Submit --- */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting} aria-busy={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? t('button.loading') || 'Menyimpan...' : t('button.save') || 'Simpan Pengaturan'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
