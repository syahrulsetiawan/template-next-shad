'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal
} from 'lucide-react';

import {
  AdminPortalPlatform,
  AdminPortalUserThings,
  AdminPortalUserData
} from '@/data/Menu';

import {NavMain} from '@/components/nav-main';
import {NavProjects} from '@/components/nav-projects';
import {NavUser} from '@/components/nav-user';
import {TeamSwitcher} from '@/components/layout/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import {NavbarComponent} from './NavbarComponent';
import {useUser} from '@/contexts/UserContext';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  teams: [
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
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: PieChart
    },
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#'
        },
        {
          title: 'Starred',
          url: '#'
        },
        {
          title: 'Settings',
          url: '#'
        }
      ]
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#'
        },
        {
          title: 'Explorer',
          url: '#'
        },
        {
          title: 'Quantum',
          url: '#'
        }
      ]
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#'
        },
        {
          title: 'Get Started',
          url: '#'
        },
        {
          title: 'Tutorials',
          url: '#'
        },
        {
          title: 'Changelog',
          url: '#'
        }
      ]
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Company',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map
    }
  ]
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {dataUser} = useUser();
  const userLoggedIn = {
    name: dataUser?.name || 'Guest User',
    email: dataUser?.email || 'guest@example.com'
  };
  // Debugging
  React.useEffect(() => {
    console.log('[AppSidebar] dataUser:', dataUser);

    // Check cookie
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const userCookie = getCookie('X-LANYA-USER');
    console.log(
      '[AppSidebar] X-LANYA-USER cookie:',
      userCookie ? 'EXISTS' : 'NOT FOUND'
    );

    if (userCookie) {
      try {
        const parsed = JSON.parse(userCookie);
        console.log('[AppSidebar] Parsed cookie data:', parsed);
      } catch (e) {
        console.error('[AppSidebar] Failed to parse cookie:', e);
      }
    }
  }, [dataUser]);

  return (
    <Sidebar collapsible="icon" {...props} variant="sidebar">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavbarComponent groupLabel="Platform" items={AdminPortalPlatform} />
        <NavbarComponent groupLabel="User" items={AdminPortalUserThings} />
        <NavbarComponent groupLabel="Data" items={AdminPortalUserData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userLoggedIn} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
