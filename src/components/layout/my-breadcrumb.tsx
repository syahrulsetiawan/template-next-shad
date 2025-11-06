'use client';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../ui/breadcrumb';
import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';

export const MyBreadcrumb = () => {
  const segments = usePathname().split('/').filter(Boolean);
  const t = useTranslations('breadcrumb');
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) =>
            index < segments.length - 1 ? (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink
                    href={`/${segments.slice(0, index + 1).join('/')}`}
                  >
                    {t(segment)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : (
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>{t(segment)}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};
