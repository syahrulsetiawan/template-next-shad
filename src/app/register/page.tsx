'use client';
import {redirect} from 'next/navigation';
import {useLocale, useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {z} from 'zod';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {loginUser} from '@/services/session';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {use, useState} from 'react';
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

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');
  const v = useTranslations('common.validation');
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const registerFormSchema = z
    .object({
      first_name: z
        .string({required_error: v('required', {field: t('firstName')})})
        .min(1, {message: v('minLength', {min: '1'})})
        .max(30, {message: v('maxLength', {max: '30'})}),
      last_name: z
        .string({required_error: v('required', {field: t('lastName')})})
        .min(1, {message: v('minLength', {min: '1'})})
        .max(30, {message: v('maxLength', {max: '30'})}),
      username: z
        .string({required_error: v('required', {field: 'Username'})})
        .min(6, {message: v('minLength', {min: '6'})})
        .max(50, {message: v('maxLength', {max: '50'})}),
      email: z
        .string({required_error: v('required', {field: 'Username'})})
        .email(v('email'))
        .min(6, {message: v('minLength', {min: '6'})})
        .max(50, {message: v('maxLength', {max: '50'})}),
      password: z
        .string({required_error: v('required', {field: 'Password'})})
        .min(8, {message: v('minLength', {min: '8'})})
        .max(20, {message: v('maxLength', {max: '20'})}),
      password_confirmation: z
        .string({required_error: v('required', {field: t('confirmPassword')})})
        .min(8, {message: v('minLength', {min: '8'})})
        .max(20, {message: v('maxLength', {max: '20'})})
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t('invalidPasswordConfirmation'),
      path: ['password_confirmation'] // Pesan error akan muncul di field ini
    });

  type IRegisterFormSchema = z.infer<typeof registerFormSchema>;

  const form = useForm<IRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema)
  });

  const onSubmit = (data: IRegisterFormSchema) => {
    setIsLoading(true);
    // alert(JSON.stringify(data));
    console.log(data);
    setTimeout(() => {
      redirect('/aether');
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="border h-full flex flex-col items-center justify-center">
      <Card className="w-[480px] border-purple-400 shadow-lg shadow-purple-400/20">
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
                <div className="flex justify-between gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          {t('firstName')}{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t('firstName')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          {t('lastName')}{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t('lastName')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          Username <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          {t('email')}{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          {t('password')}{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={t('password')} {...field} />
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
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          {t('confirmPassword')}{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('confirmPassword')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="w-full mt-4" type="submit">
                  {isLoading ? <Loader2Icon className="animate-spin" /> : null}
                  {t('register')}
                </Button>
              </form>
            </Form>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4 mb-2">
            <p className="text-sm">
              {t('alreadyRegistered')}{' '}
              <span className="font-bold underline cursor-pointer">
                {t('loginLink')}
              </span>
            </p>
            {/* <Button variant="secondary" className="w-full">
              {t('loginLink')}
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
