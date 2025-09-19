// src/pages/index.tsx
'use client'
import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { GetServerSidePropsContext } from "next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/auth";
import { useSession } from "next-auth/react";

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
   const session = useSession();
  const [isGameStarted, setGameStarted] = useState(false);

  return (
    <>
      <Head>
        <title>Pixel Coops</title>
        <meta
          name="description"
          content="A Web3 game built with Phaser and Next.js"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        {isGameStarted ? (
          <AppWithoutSSR />
        ) : (
          <LoginScreen onGameStart={() => setGameStarted(true)} />
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authConfig);
  // We could also initialize iron-session here, but since nonce
  // handling is done in the API, there is generally no need
  // to do anything directly here. Passing the cookie is enough.
  const cookie = context.req.headers.cookie || "";

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)) || null,
      cookie,
    },
  };
}
