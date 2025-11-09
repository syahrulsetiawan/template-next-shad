'use client';

import * as React from 'react';
import Link from 'next/link';
import {CircleCheckIcon, CircleHelpIcon, CircleIcon} from 'lucide-react';
import {menu} from '@/data/Menu';

import {useIsMobile} from '@/hooks/use-mobile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import {useTranslations} from 'next-intl';

const components: {title: string; href: string; description: string}[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.'
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.'
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.'
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'
  }
];

export function NavigationMenuDemo() {
  const t = useTranslations('menu');
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap">
        {menu.map((item) => (
          <NavigationMenuItem key={item.title} className="hidden md:block">
            {item.items ? (
              <>
                <NavigationMenuItem
                  key={item.title}
                  className="hidden md:block"
                ></NavigationMenuItem>
                <NavigationMenuTrigger>{t(item.title)}</NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid w-7xl gap-4">
                    <li className="p-2 row-span-3">
                      <NavigationMenuLink asChild className="p-4">
                        <Link href="#">Components</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="p-4">
                        <Link href="#">Documentation</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild className="p-4">
                        <Link href="#">Blocks</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.url}>
                  <item.icon size={'16'} className="me-2" /> {t(item.title)}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}

        
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {href: string}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
