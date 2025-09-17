import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import Providers from "../components/auth/Provider";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

import { GameProvider } from "@/context/GameContext";

type MyAppPageProps = AppProps["pageProps"] & {
  session?: Session | null;
  cookie?: string;
};

function MyApp({
  Component,
  pageProps,
}: AppProps<MyAppPageProps>) {
  const { session, cookie, ...restPageProps } = pageProps;

  return (
    <Providers session={session ?? undefined} cookie={cookie}>
      <GameProvider>
        <Component {...restPageProps} />
      </GameProvider>
    </Providers>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;

  const session = await getSession(ctx);
  const cookie = ctx.req?.headers.cookie ?? "";

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      session,
      cookie,
    },
  };
};

export default MyApp;

