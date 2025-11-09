import React from 'react';
import { Spinner } from '../ui/spinner';

type MyFullLoadingPageProps = {
  isLoading: boolean;
};

const MyFullLoadingPage = ({isLoading}: MyFullLoadingPageProps) => {
  return (
    <div
      className="absolute top-0 left-0 z-50 w-full h-full bg-neutral-800/50 backdrop-blur-sm flex flex-col items-center justify-center text-white font-semibold gap-4"
      style={{display: isLoading ? 'flex' : 'none'}}
    >
      {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div> */}
      <Spinner className='size-8' />
      <div>Loading data...</div>
    </div>
  );
};

export default MyFullLoadingPage;
