'use client';
import {UsersIcon} from '@heroicons/react/24/outline';
import {isEqual, set} from 'lodash';
import {redirect} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {z} from 'zod';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {loginUser} from '@/services/session';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {Loader2Icon} from 'lucide-react';
import authService from '@/services/authService';
import {AxiosError} from 'axios';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const v = useTranslations('common.validation');
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginFormSchema = z.object({
    email: z
      .string({required_error: v('required', {field: 'email'})})
      .email(v('email'))
      .min(6, {message: v('minLength', {min: '6'})})
      .max(50, {message: v('maxLength', {max: '50'})}),
    password: z
      .string({required_error: v('required', {field: 'Password'})})
      .min(8, {message: v('minLength', {min: '8'})})
      .max(20, {message: v('maxLength', {max: '20'})})
  });

  type ILoginFormSchema = z.infer<typeof loginFormSchema>;

  const form = useForm<ILoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit = async (data: ILoginFormSchema) => {
    if (!isLoading) {
      setIsLoading(true);

      try {
        // Panggil fungsi login dari authService
        const response = await authService.login(data);
        console.log('Login berhasil:', response);
        toast.success('Login Success', {
          description: 'Welcome Back, Syahrul',
          position: 'top-center'
        });

        // Redirect ke halaman dashboard atau halaman utama setelah login sukses
        // Contoh:
        window.location.href = '/aether';
      } catch (err: any) {
        // Pastikan error adalah AxiosError untuk mengakses responsnya
        if (err instanceof AxiosError && err.response) {
          // Asumsi format error server: { success, message, data, error: { code, message, details: [{ message, field }] } }
          const serverResponse = err.response.data;
          if (serverResponse.error.code == 403) {
            toast.error(t('locked.title'), {
              description: t('locked.description'),
              position: 'top-center'
            });
          }
          // Tangani error spesifik pada field (misalnya, password tidak cocok)
          if (
            serverResponse.error &&
            serverResponse.error.details &&
            serverResponse.error.details.length > 0
          ) {
            serverResponse.error.details.forEach(
              (detail: {field: keyof ILoginFormSchema; message: string}) => {
                // Gunakan `setError` dari react-hook-form untuk menampilkan error
                form.setError(detail.field, {
                  type: 'server',
                  message: detail.message
                });
              }
            );
          }

          // Tangani pesan error umum (misalnya, Bad Request)
          if (serverResponse.message) {
            setServerError(serverResponse.message);
          }
        } else {
          // Tangani error lain, seperti masalah jaringan atau error tak terduga
          setServerError('An unknown error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="border h-full flex flex-col items-center justify-center">
      <Card className="w-[350px] border-purple-400 shadow-lg shadow-purple-400/20">
        <CardContent>
          <div className="flex flex-col items-center mb-8">
            <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
              {t('title')}
            </h1>
            <p className="mt-2 text-muted-foreground">{t('description')}</p>
          </div>
          <div className="form">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>email</FormLabel>
                        <FormControl>
                          <Input placeholder="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>password</FormLabel>
                        <FormControl>
                          <Input placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button className="w-full mt-4" type="submit">
                  {isLoading ? <Loader2Icon className="animate-spin" /> : null}
                  {t('login')}
                </Button>
              </form>
            </Form>
          </div>
          <Separator className="my-4" />
          <Button variant="secondary" className="w-full">
            Register
          </Button>
        </CardContent>
        <CardFooter>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('credentials')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
