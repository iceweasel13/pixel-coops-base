// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Providers from "../components/Provider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <Providers session={session} cookie={pageProps.cookie}>
      <Component {...pageProps} />
    </Providers>
  );
}