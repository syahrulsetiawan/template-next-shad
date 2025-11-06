import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  images: {
    domains: [
      'https://images.unsplash.com', // tambahkan domain eksternal yang lu pakai
      'cdn.example.com',
      // domain lain sesuai kebutuhan
    ],
  },
};

export default withNextIntl(config);
