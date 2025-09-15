// src/components/Provider.tsx

"use client";
import { ReactNode } from "react";
import RainbowKitProvider from "./RainbowKitProvider";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function Providers({
  children,
  cookie,
  session,
}: {
  children: ReactNode;
  cookie: string;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <RainbowKitProvider cookie={cookie}>{children}</RainbowKitProvider>
    </SessionProvider>
  );
}