// Konum: src/pages/index.tsx

import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth"; // Bu dosya yolunun doğru olduğundan emin ol

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    const [isGameStarted, setGameStarted] = useState(false);

    return (
        <>
            <Head>
                <title>Phaser Web3 Game</title>
                <meta name="description" content="A Web3 game built with Phaser and Next.js" />
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

// Bu fonksiyon sunucuda çalışarak session ve cookie'yi alır.
// 'output: export' kaldırıldığı için artık sorunsuz çalışacaktır.
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authConfig);
    const cookie = context.req.headers.cookie || "";

    return {
        props: {
            // Session objesini serialize edilebilir hale getiriyoruz.
            session: session ? JSON.parse(JSON.stringify(session)) : null,
            cookie,
        },
    };
}