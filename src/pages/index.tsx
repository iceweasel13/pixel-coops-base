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
        <title>Phaser Web3 Game</title>
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
  // iron-session'ı da burada başlatabiliriz, ancak nonce yönetimi API'da yapıldığı için
  // genellikle burada doğrudan bir işlem yapmaya gerek kalmaz.
  // Sadece cookie'yi client'a iletmek yeterlidir.
  const cookie = context.req.headers.cookie || "";

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)) || null,
      cookie,
    },
  };
}