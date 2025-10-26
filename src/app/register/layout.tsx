import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import NavLink from '@/components/NavLink';

export default function AppLayout({children}: {children: ReactNode}) {
  return (
    <div className="bg-auth absolute top-0 w-screen h-screen">{children}</div>
  );
}
