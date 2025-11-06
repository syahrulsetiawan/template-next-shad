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

export interface ICompanySettingsProps {
}

// SOLUSI: company_website diubah menjadi .url().or(z.literal('')) agar bisa kosong
const companySettingsSchema = z.object({
  company_name: z.string().min(1, 'Nama perusahaan wajib diisi.'),
  company_address: z.string().min(1, 'Alamat perusahaan wajib diisi.'),
  company_photo: z.string().optional(),
  company_phone: z.string().min(1, 'Nomor telepon wajib diisi.'),
  company_email: z.string().email('Format email tidak valid.'),
  company_website: z.string().url('URL website tidak valid.').or(z.literal('')), // Memperbolehkan string kosong
  company_tax_number: z.string().min(1, 'Nomor pajak wajib diisi.'),
  company_country: z.string().min(1, 'Negara wajib diisi.'),
  company_province: z.string().min(1, 'Provinsi wajib diisi.'),
  company_city: z.string().min(1, 'Kota wajib diisi.'),
  company_postal_code: z.string().min(1, 'Kode pos wajib diisi.'),
});

type ICompanySettingsSchema = z.infer<typeof companySettingsSchema>;

export default function CompanySettingsPage (props: ICompanySettingsProps) {
  // Ganti dengan string literal jika i18n belum disiapkan
  const t = useTranslations('default.CompanySettingsPage'); 
  
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
                        {renderInputField('company_address', 'Alamat Lengkap', 'Masukkan alamat lengkap perusahaan')}
                      </div>

                      {/* --- BAGIAN LOKASI (2 Kolom) --- */}
                      {renderInputField('company_country', 'Negara', 'Contoh: Indonesia')}
                      {renderInputField('company_province', 'Provinsi', 'Contoh: DKI Jakarta')}
                      {renderInputField('company_city', 'Kota/Kabupaten', 'Contoh: Jakarta Pusat')}
                      {renderInputField('company_postal_code', 'Kode Pos', 'Contoh: 10110')}
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
                    <p>
                      We stand behind our products with a comprehensive 30-day return
                      policy. If you&apos;re not completely satisfied, simply return the
                      item in its original condition.
                    </p>
                    <p>
                      Our hassle-free return process includes free return shipping and
                      full refunds processed within 48 hours of receiving the returned
                      item.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* --- Tombol Submit --- */}
              <div className="md:col-span-2 flex justify-end pt-4">
                  <Button 
                      type="submit"
                      disabled={form.formState.isSubmitting}
                  >
                      {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}