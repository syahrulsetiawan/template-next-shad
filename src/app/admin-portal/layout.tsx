import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import {AppSidebar} from '@/components/layout/app-sidebar';
import {Separator} from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

import SearchPanel from '@/components/SearchPanel';
import {Toaster} from '@/components/ui/sonner';
import {UserSetting} from '@/components/user-setting';
import {MyBreadcrumb} from '@/components/my-breadcrumb';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import {NavigationMenuDemo} from '@/components/navbar';
import {TeamSwitcher} from '@/components/team-switcher';
import {AudioWaveform, Command, GalleryVerticalEnd} from 'lucide-react';
import {MyNotification} from '@/components/Notification';

const teams = [
  {
    name: 'Acme Inc',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise'
  },
  {
    name: 'Acme Corp.',
    logo: AudioWaveform,
    plan: 'Startup'
  },
  {
    name: 'Evil Corp.',
    logo: Command,
    plan: 'Free'
  }
];
export default function AppLayout({children}: {children: ReactNode}) {
  const t = useTranslations('AppLayout');

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4 hidden md:block"
                />
                <div className="hidden md:block">
                  <MyBreadcrumb />
                </div>
              </div>
              <div className="flex items-center gap-2 px-4">
                <SearchPanel />
                <MyNotification />
                <LocaleSwitcher />
                <UserSetting />
              </div>
            </div>
          </header>
          <div className="block lg:hidden px-4 mb-2">
            <MyBreadcrumb />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <main>{children}</main>
          </div>
          <Toaster richColors />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
