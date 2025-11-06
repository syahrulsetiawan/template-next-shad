'use client';

import { ImageCarousel } from '@/components/image/ImageCarousel';
import { ImageGallery } from '@/components/image/ImageGallery';
import { SingleImageViewer } from '@/components/image/SingleImageViewer';
import MyFullLoadingPage from '@/components/layout/MyFullLoadingPage';
import {Button} from '@/components/ui/button';
import {useLoading} from '@/hooks/useLoading';
import {useEffect} from 'react';
import {toast} from 'sonner';

const images = [
    { src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d" },
    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
    { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" },
    { src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d" },
  ];

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
        <div className="bg-muted/50 aspect-video rounded-xl p-4">
          <SingleImageViewer
            src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
            alt="Sample"
            width={100}
            height={100}
          /><br />
          <div>
            <ImageGallery
              images={images}
              thumbnailWidth={100}
              thumbnailHeight={100}
              columns={2}
              gap={12}
            />
          </div>
          <div className="flex justify-center items-center bg-muted/10 p-4">
            <ImageCarousel images={images} width={300} height={200} rounded />
          </div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
