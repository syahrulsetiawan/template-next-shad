'use client';

import * as React from 'react';
import {Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {ButtonGroup} from '../ui/button-group';
import {useUserConfig} from '@/hooks/useUserConfig';

export function ModeToggle() {
  const {theme} = useTheme();
  const {updateConfig} = useUserConfig();

  const toggleDarkMode = (mode: 'light' | 'dark' | 'by_system') => {
    updateConfig({dark_mode: mode});
  };

  return (
    <ButtonGroup>
      <Button
        onClick={() => toggleDarkMode('light')}
        disabled={theme === 'light'}
        variant={'outline'}
      >
        Light
      </Button>
      <Button
        onClick={() => toggleDarkMode('dark')}
        disabled={theme === 'dark'}
        variant={'outline'}
      >
        Dark
      </Button>
      <Button
        onClick={() => toggleDarkMode('by_system')}
        disabled={theme === 'system'}
        variant={'outline'}
      >
        System
      </Button>
    </ButtonGroup>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="ghost" size="icon">
    //       <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
    //       <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme('light')}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme('dark')}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme('system')}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
