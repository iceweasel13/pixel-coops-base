// Konum: src/pages/_app.tsx

import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

// NextAuth için SessionProvider'ı import et
import { SessionProvider } from 'next-auth/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

// Wagmi yapılandırması
const config = getDefaultConfig({
  appName: 'Phaser Web3 Game',
  projectId: 'c7afbc6898aeadee594c90c8dead3ec8', // WalletConnect Cloud'dan alacağın proje ID'si
  chains: [mainnet, sepolia],
  ssr: false, 
});

const queryClient = new QueryClient();

// App bileşeni 'async' olmamalıdır.
// pageProps'tan session'ı alıp SessionProvider'a iletiyoruz.
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}