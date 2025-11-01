import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {Settings} from 'lucide-react';
import {useTranslations} from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';
import {ModeToggle} from './ToggleDarkmode';
import {RadioGroup, RadioGroupItem} from './ui/radio-group';
import {Switch} from './ui/switch';

export function UserSetting() {
  const t = useTranslations('AppLayout');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Settings</SheetTitle>
          <SheetDescription>{t('user_setting_description')}</SheetDescription>
        </SheetHeader>
        <hr className="my-4" />
        <div className="block my-4 py-2">
          <div className="text-sm mb-2">Theme :</div>
          <ModeToggle />
        </div>
        {/* fullwidith */}
        <div className="block my-4 py-2">
          <div className="text-sm mb-2">Full Width :</div>
          <RadioGroup defaultValue="boxed" className="flex gap-3">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="full" id="layout_full" />
              <Label htmlFor="layout_full">Full Width</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="boxed" id="layout_boxed" />
              <Label htmlFor="layout_boxed">Boxed</Label>
            </div>
          </RadioGroup>
        </div>

        {/* layout */}
        <div className="block my-4 py-2">
          <div className="text-sm mb-2">Menu Layout :</div>
          <RadioGroup defaultValue="vertical" className="flex gap-3">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="horizontal" id="layout_horizontal" />
              <Label htmlFor="layout_horizontal">Horizontal</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="vertical" id="layout_vertical" />
              <Label htmlFor="layout_vertical">Vertical</Label>
            </div>
          </RadioGroup>
        </div>

        {/* email-notifications */}
        <div className="block my-4 py-2">
          <div className="text-sm mb-2">Email Notifications :</div>
          <Switch id="email-notifications" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
