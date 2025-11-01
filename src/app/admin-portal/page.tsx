'use client';

import MyFullLoadingPage from '@/components/MyFullLoadingPage';
import {Button} from '@/components/ui/button';
import {useLoading} from '@/hooks/useLoading';
import {useEffect} from 'react';
import {toast} from 'sonner';

export default function Page() {
  const {isLoading, startLoading, stopLoading} = useLoading();
  const handleNotification = () => {
    toast.success('This is a success message!');
  };
  useEffect(() => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, 2000);
    handleNotification();
  }, []);
  return (
    <div className="">
      <MyFullLoadingPage isLoading={isLoading} />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
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
