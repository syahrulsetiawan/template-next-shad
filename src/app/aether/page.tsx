import {AppSidebar} from '@/components/app-sidebar';
import CustomInput from '@/components/custom/Input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import {MailIcon} from 'lucide-react';

export default function Page() {
  return (
    <div className="">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <CustomInput
                label="Email"
                name="email"
                type="text"
                placeholder="Automate by system"
                error="This field is required"
                required
                readOnly
                autoComplete="off"
                // onChange={handleChange}
                icon={<MailIcon size={16} />}
                iconPosition="left"
              />
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <small className="text-destructive">*</small>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" size={'sm'} className="w-full">
              Login
            </Button>
            <Button variant="outline" size={'sm'} className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
        <div className="bg-muted/50 aspect-video rounded-xl p-4">
          <Button size={'sm'}>Primary</Button>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
