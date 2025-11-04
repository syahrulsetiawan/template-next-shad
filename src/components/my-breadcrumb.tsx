'use client';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb';
import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Home} from 'lucide-react';

export const MyBreadcrumb = () => {
  const segments = usePathname().split('/').filter(Boolean);
  const t = useTranslations('breadcrumb');
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              <Home width={12} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {segments.map((segment, index) =>
            index < segments.length - 1 ? (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                    href={`/${segments.slice(0, index + 1).join('/')}`}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    {t(segment)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage className="text-foreground font-semibold text-xs">
                  {t(segment)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
