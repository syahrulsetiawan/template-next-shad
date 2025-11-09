import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import NavLink from '@/components/NavLink';
import {Toaster} from '@/components/ui/sonner';

export default function AppLayout({children}: {children: ReactNode}) {
  return (
    <div className="absolute top-0 w-screen h-screen overflow-hidden">
      {children}
      <Toaster richColors />
    </div>
  );
}
