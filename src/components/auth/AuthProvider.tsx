"use client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider baseUrl={process.env.NEXTAUTH_URL} session={session}>
      {children}
    </SessionProvider>
  );
}

