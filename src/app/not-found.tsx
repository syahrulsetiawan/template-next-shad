// app/not-found.tsx
import Link from 'next/link';
import {headers} from 'next/headers'; // Untuk mendapatkan path (opsional)

export default function NotFound() {
  const headersList = headers();
  // Karena 'x-invoke-path' bisa null, kita tambahkan fallback string
  const fullPath: string = 'Unknown path';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-center p-4">
      <h1 className="text-9xl font-extrabold text-neutral-600">404</h1>
      <h2 className="text-md font-semibold text-neutral-800 mt-4 mb-4 max-w-[546px]">
        The page you are looking for might have been removed had its name
        changed or is temporarily unavailable.
      </h2>
      <Link
        href="/"
        className="px-6 py-3 text-lg font-medium text-white bg-neutral-600 rounded-lg hover:bg-neutral-700 transition duration-150"
      >
        Back to Home
      </Link>
    </div>
  );
}
