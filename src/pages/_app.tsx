import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Providers from "../components/auth/Provider";
import { GameProvider } from "@/context/GameContext";


function MyApp({ Component, pageProps }: AppProps) {
  return (
   
    <Providers session={pageProps.session}>
      <GameProvider>
        <Component {...pageProps} />
      </GameProvider>
    </Providers>
  );
}

// MyApp.getInitialProps bloğunu TAMAMEN SİLİYORUZ.

export default MyApp;