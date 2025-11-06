"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
// SOLUSI: Import Form, FormControl, dst, semuanya dari @/components/ui/form
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; 
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import * as React from 'react';
// SOLUSI: Hanya impor useForm dari react-hook-form untuk menghindari konflik nama
import { useForm } from 'react-hook-form'; 
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea untuk alamat
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Building, MapPin, Settings } from 'lucide-react';
import { ImageUploader } from '@/components/form/ImageUploader';
import { useLoading } from '@/hooks/useLoading';
import MyFullLoadingPage from '@/components/layout/MyFullLoadingPage';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ICompanySettingsProps {
}

const currencyFormatOptions = [
  { value: '#,###,###', label: '9,999,999' },
  { value: '#.###.###', label: '9.999.999' },
];

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
];

export default function CompanySettingsPage (props: ICompanySettingsProps) {
  const {isLoading, startLoading, stopLoading} = useLoading();
  // Ganti dengan string literal jika i18n belum disiapkan
  const t = useTranslations('default.CompanySettingsPage'); 
  const v = useTranslations('common.validation');

  // SOLUSI: company_website diubah menjadi .url().or(z.literal('')) agar bisa kosong
  const companySettingsSchema = z.object({
    company_name: z.string().min(1, {message: v('required', {field: t('form.companyName.label') || 'company_name'})}),
    company_address: z.string().min(1, {message: v('required', {field: t('form.companyAddress.label') || 'company_address'})}),
    company_photo: z.string().optional(),
    company_phone: z.string().min(1, {message: v('required', {field: t('form.companyPhone.label') || 'company_phone'})}),
    company_email: z.string().email({message: v('email', {field: t('form.companyEmail.label') || 'company_email'})}),
    company_website: z.string().url({message: v('url', {field: t('form.companyWebsite.label') || 'company_website'})}).or(z.literal('')), // Memperbolehkan string kosong
    company_tax_number: z.string().min(1, {message: v('required', {field: t('form.companyTaxNumber.label') || 'company_tax_number'})}),
    company_country: z.string().min(1, {message: v('required', {field: t('form.companyCountry.label') || 'company_country'})}),
    company_province: z.string().min(1, {message: v('required', {field: t('form.companyProvince.label') || 'company_province'})}),
    company_city: z.string().min(1, {message: v('required', {field: t('form.companyCity.label') || 'company_city'})}),
    company_postal_code: z.string().min(1, {message: v('required', {field: t('form.companyPostalCode.label') || 'company_postal_code'})}),
    config_dateformat: z.enum(dateFormatOptions.map(opt => opt.value), {message: v('enum')}),
    config_currencyformat: z.enum(currencyFormatOptions.map(opt => opt.value), {message: v('enum')}),
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
        config_currencyformat: '#.###.###'
    }
  })

  const handleSubmit = (data: ICompanySettingsSchema) => {
    // Simulasi loading 1 detik
    return new Promise<void>(resolve => {
        setTimeout(() => {
            console.log('Submitted data:', data);
            alert('Pengaturan berhasil disimpan!');
            resolve();
        }, 1000);
    });
  }

  const handleImageFileChange = (file: File | null) => {
    console.log('File yang dipilih:', file);
    form.setValue('company_photo', file ? URL.createObjectURL(file) : '');
    // Di sini Anda bisa memicu validasi atau menyimpan file di state utama form
  };

  React.useEffect(() => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, 1000);
  }, []);

  const renderInputField = (name: keyof ICompanySettingsSchema, label: string, placeholder: string, type: string = 'text') => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {name === 'company_address' ? (
                <Textarea
                    placeholder={placeholder}
                    className="resize-none"
                    {...field}
                />
            ) : (
                <Input
                    type={type}
                    placeholder={placeholder}
                    {...field}
                />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  
  return (
    <div className="p-4 md:p-8">
      <MyFullLoadingPage isLoading={isLoading} />
      <Card>
        <CardHeader>
          <h1 className="text-2xl text-foreground font-bold">{t('title') || 'Pengaturan Perusahaan'}</h1>
          <p className="text-muted-foreground text-sm">{t('description') || 'Kelola informasi dasar dan alamat perusahaan Anda.'}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              className="w-full"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-muted-foreground'>
                    <div className="flex  items-center gap-2">
                      <Building width={16} />
                      {t('companyInformation')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="block md:grid grid-cols-2 gap-6 p-2">
                      {/* --- BAGIAN INFORMASI DASAR --- */}
                      {renderInputField('company_name', t('form.companyName.label'), t('form.companyName.placeholder'))}
                      {renderInputField('company_tax_number', t('form.companyTaxNumber.label'), t('form.companyTaxNumber.placeholder'))}
                      {renderInputField('company_email', t('form.companyEmail.label'), t('form.companyEmail.placeholder'), 'email')}
                      {renderInputField('company_phone', t('form.companyPhone.label'), t('form.companyPhone.placeholder'), 'tel')}
                      {renderInputField('company_website', t('form.companyWebsite.label'), t('form.companyWebsite.placeholder'))}

                      <FormField
                        control={form.control}
                        name="company_photo"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                          <FormItem>
                            <FormControl>
                              <ImageUploader
                                label={t('form.companyLogo.label') || 'Company Logo'}
                                onFileChange={handleImageFileChange}
                                className="mb-6"
                                initialImage={form.getValues('company_photo')}
                                // Hanya menerima JPEG dan PNG
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
                <AccordionItem value="item-2">
                  <AccordionTrigger className='text-muted-foreground'>
                    <div className="flex items-center gap-2">
                      <MapPin width={16} />
                      {t('companyAddress')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="block md:grid grid-cols-2 gap-6 p-2">

                      {/* --- BAGIAN ALAMAT (Memakai 2 kolom penuh untuk Address) --- */}
                      <div className="md:col-span-2">
                        {renderInputField('company_address', t('form.companyAddress.label'), t('form.companyAddress.placeholder'))}
                      </div>

                      {/* --- BAGIAN LOKASI (2 Kolom) --- */}
                      {renderInputField('company_country', t('form.companyCountry.label'), t('form.companyCountry.placeholder'))}
                      {renderInputField('company_province', t('form.companyProvince.label'), t('form.companyProvince.placeholder'))}
                      {renderInputField('company_city', t('form.companyCity.label'), t('form.companyCity.placeholder'))}
                      {renderInputField('company_postal_code', t('form.companyPostalCode.label'), t('form.companyPostalCode.placeholder'))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className='text-muted-foreground'>
                    <div className="flex items-center gap-2">
                      <Settings width={16} />
                      {t('configuration')}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-balance">
                    <div className="block md:grid grid-cols-2 gap-6 p-2">
                      {/* --- BAGIAN KONFIGURASI --- */}
                      <FormField
                        control={form.control}
                        name="config_dateformat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.configDateFormat.label')}</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}               // <-- bind ke field.value
                                onValueChange={(val) => field.onChange(val)} // <-- panggil onChange form
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a date format" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Date Format</SelectLabel>
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
                      <FormField
                        control={form.control}
                        name="config_dateformat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('form.configCurrencyFormat.label')}</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}               // <-- bind ke field.value
                                onValueChange={(val) => field.onChange(val)} // <-- panggil onChange form
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a currency format" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Currency Format</SelectLabel>
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* --- Tombol Submit --- */}
              <div className="md:col-span-2 flex justify-end pt-4">
                  <Button 
                      type="submit"
                      disabled={form.formState.isSubmitting}
                  >
                      {form.formState.isSubmitting ? t('button.loading') : t('button.save')}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}