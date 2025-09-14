// Konum: src/pages/index.tsx

import Head from "next/head";
import dynamic from "next/dynamic";
import { useState } from "react";
import { LoginScreen } from "@/components/LoginScreen";

// Phaser oyununu SSR olmadan yüklüyoruz
const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    // Oyuncunun oyuna girip girmediğini tutan state
    const [isGameStarted, setGameStarted] = useState(false);

    return (
        <>
            <Head>
                <title>Phaser Web3 Game</title>
                <meta name="description" content="A Web3 game built with Phaser and Next.js" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
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