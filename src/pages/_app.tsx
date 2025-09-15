// src/pages/_app.tsx

import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Providers from "../components/auth/Provider";
import { getSession, Session } from "next-auth/react"; // next-auth/react'ten getSession'ı import et

function MyApp({
  Component,
  pageProps: { session, cookie, ...pageProps }, // session ve cookie'yi pageProps'tan çıkar
}: AppProps & { pageProps: { session: Session | null, cookie?: string } }) {
  return (
    <Providers session={session} cookie={cookie}>
      <Component {...pageProps} />
    </Providers>
  );
}

// Sunucu tarafında veya ilk yüklemede çalışacak kısım
MyApp.getInitialProps = async (appContext: AppContext) => {
  // next/app'in kendi getInitialProps'unu çalıştırarak diğer sayfalardaki
  // getInitialProps'ların çalışmasını sağlıyoruz.
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;

  // Sunucu tarafında session ve cookie bilgilerini al
  const session = await getSession(ctx);
  const cookie = ctx.req?.headers.cookie;

  // Bu bilgileri pageProps olarak component'e gönder
  appProps.pageProps.session = session;
  appProps.pageProps.cookie = cookie;

  return { ...appProps };
};

export default MyApp;