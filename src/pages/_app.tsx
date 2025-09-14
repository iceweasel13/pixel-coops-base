// Konum: src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Providers from '../components/Provider'; // Senin Providers bileşenin

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers session={pageProps.session} cookie={pageProps.cookie}>
      <Component {...pageProps} />
    </Providers>
  );
}