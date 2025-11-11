'use client';
import {redirect} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {z} from 'zod';
import {toast} from 'sonner';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import LocaleSwitcher from '@/components/LocaleSwitcher';
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
import Image from 'next/image';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import Link from 'next/link';

// --- Import hook yang baru dibuat ---
import {useUserLogin} from '@/hooks/useUserLogin'; // Asumsikan path hook Anda
import {useTheme} from 'next-themes';
import LogoLight from '@/components/image/LogoLight';
import LogoDark from '@/components/image/LogoDark';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const e = useTranslations('errorResponse');
  const v = useTranslations('common.validation');
  const {theme} = useTheme();
  const locale = useLocale();

  // --- Gunakan hook yang baru ---
  const {setAllData, dataUser} = useUserLogin(); // Ambil fungsi untuk menyimpan data user

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
    if (isLoading) return; // Guard clause untuk mencegah multiple submit

    setIsLoading(true);

    try {
      // 1. Panggil fungsi login (sudah otomatis simpan token dan return user data)
      const userData = await authService.login(data);

      // 2. Simpan data user ke state melalui hook
      setAllData(userData);

      toast.success('Login Success', {
        description: `Welcome Back, ${userData.name}`,
        position: 'top-center'
      });

      // 3. Redirect ke halaman dashboard berdasarkan lastServiceKey
      const lastService = userData.lastServiceKey || 'app';
      redirect(`/${lastService}`);
    } catch (err: any) {
      console.error('Login failed:', err);

      // Penanganan error
      const errorReason = err.reason || 'something_went_wrong';
      toast.error(e(errorReason + '.title'), {
        description: e(errorReason + '.description'),
        position: 'top-center'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ... Bagian Render (tetap sama) ...
    <div className="flex flex-col items-center justify-center">
      <div className="w-screen h-screen block md:flex items-center justify-center">
        {/* form */}
        <div className="w-full md:w-1/2 h-full bg-background flex flex-col justify-between">
          <div className="p-4 flex justify-end">
            <LocaleSwitcher />
          </div>
          <div className="flex flex-col items-center pb-12">
            {theme === 'dark' || theme === 'system' ? (
              <LogoLight />
            ) : (
              <LogoDark />
            )}
            {/* <h5 className="text-lg text-foreground">{t('login')}</h5> */}
            <p className="text-muted-foreground mt-4 mb-8">
              {t('description')}
            </p>

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
                  <Button
                    className="w-full mt-4"
                    type="submit"
                    disabled={isLoading}
                  >
                    {/* Tambahkan disabled={isLoading} */}
                    {isLoading ? (
                      <Loader2Icon className="animate-spin mr-2" />
                    ) : null}
                    {t('login')}
                  </Button>
                </form>
              </Form>
            </div>
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
        <div className="hidden md:flex w-1/2 h-full relative justify-end p-4">
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
    </div>
  );
}
