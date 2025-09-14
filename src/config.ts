"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage, http } from "wagmi";
import { baseSepolia, monadTestnet, polygon } from "viem/chains";
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

export const config = getDefaultConfig({
  appName: 'Pixel Coop',
  
  projectId: projectId,
  chains: [baseSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [baseSepolia.id]: http(), 
    
  },
});
