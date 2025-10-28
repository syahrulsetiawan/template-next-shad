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
import {Check, Loader2Icon} from 'lucide-react';
import authService from '@/services/authService';
import {AxiosError} from 'axios';
import Image from 'next/image';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const v = useTranslations('common.validation');
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginFormSchema = z.object({
    credentials: z
      .string({required_error: v('required', {field: 'credentials'})})
      .min(6, {message: v('minLength', {min: '6'})})
      .max(50, {message: v('maxLength', {max: '50'})}),
    password: z
      .string({required_error: v('required', {field: 'Password'})})
      .min(8, {message: v('minLength', {min: '8'})})
      .max(20, {message: v('maxLength', {max: '20'})}),
    rememberMe: z.boolean().optional()
  });

  type ILoginFormSchema = z.infer<typeof loginFormSchema>;

  const form = useForm<ILoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data: ILoginFormSchema) => {
    console.log('Form Data:', data);
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

          if (serverResponse.error.reason) {
            toast.error(
              serverResponse.error.reason.title +
                (serverResponse.error.reason.description
                  ? ': ' + serverResponse.error.reason.description
                  : '')
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
    <div className="border flex flex-col items-center justify-center">
      <div className="w-screen h-screen border block lg:flex items-center justify-center">
        {/* form */}
        <div className="w-1/2 h-full bg-background flex flex-col justify-between">
          <div className="p-4 flex justify-end">
            <LocaleSwitcher />
          </div>
          <div className="flex flex-col items-center pb-12">
            <h5 className="text-lg text-foreground">{t('login')}</h5>
            <p className="text-muted-foreground mb-8">{t('description')}</p>

            <div className="form">
              <Form {...form}>
                <form
                  className="w-[350px]"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="mb-2">
                    <FormField
                      control={form.control}
                      name="credentials"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>credential</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="text"
                              placeholder="username or email or phone number"
                              {...field}
                              value={field.value ?? ''}
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
                      name="password"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel>password</FormLabel>
                          <FormControl>
                            <Input
                              required
                              type="password"
                              placeholder="password"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-2 pt-2 flex justify-between items-center">
                    <div className="flex gap-2">
                      <Checkbox
                        id="rememberMe"
                        {...form.register('rememberMe')}
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-foreground cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-foreground text-sm"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    {isLoading ? (
                      <Loader2Icon className="animate-spin" />
                    ) : null}
                    {t('login')}
                  </Button>
                </form>
              </Form>
            </div>
            {/* <div className="form">
            </div> */}
            <Separator className="my-4 w-[360px]" />
            <Link href="/register">
              <Button variant="secondary" className="w-[360px]">
                Register
              </Button>
            </Link>
          </div>
          <div className="p-4 flex justify-center">
            <div className="text-muted-foreground text-sm">
              Copyright@Saintsation.inc
            </div>
          </div>
        </div>
        {/* Background Image */}
        <div className="w-1/2 h-full relative flex justify-end p-4">
          <Image
            src="/login-bg.png"
            alt="Login Illustration"
            layout="fill"
            objectFit="cover"
          />
          <div className="w-full h-full top-0 left-0 absolute flex items-center justify-center">
            <div className="p-4 border rounded-lg bg-background">
              <h1 className="text-xl text-foreground font-bold">
                Saintsation.inc
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* <Card className="w-[350px] border-purple-400 shadow-lg shadow-purple-400/20">
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
                    name="credentials"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>credential</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="username or email or phone number"
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
          <Link href="/register">
            <Button variant="secondary" className="w-full">
              Register
            </Button>
          </Link>
        </CardContent>
        <CardFooter>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t('credentials')}
          </p>
        </CardFooter>
      </Card> */}
    </div>
  );
}
