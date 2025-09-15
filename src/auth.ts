// src/auth.ts

import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { SiweMessage } from "siwe";
import type { NextApiRequest } from "next";
import * as cookie from "cookie";
interface AuthUser {
  id: string;
  accessToken: string;
  walletAddress: string;
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        message: { label: "message", type: "string" },
        signature: { label: "signature", type: "string" },
      },
      authorize: async (credentials, req: NextApiRequest | any): Promise<AuthUser | null> => {
        if (!credentials?.message || !credentials?.signature) {
          console.error("Credentials eksik: 'message' veya 'signature' gönderilmedi.");
          return null;
        }

        try {
          const siweMessage = new SiweMessage(credentials.message);
          
          // --- DEĞİŞİKLİK: Cookie'yi headers'dan manuel olarak okuyoruz ---
          const parsedCookies = cookie.parse(req.headers?.cookie || "");
          const nonce = parsedCookies["siwe-nonce"];
          // -----------------------------------------------------------------

          if (!nonce) {
            // Daha açıklayıcı bir log ekleyelim
            console.error("Nonce cookie 'req.headers.cookie' içinde bulunamadı.");
            throw new Error("Nonce cookie bulunamadı.");
          }

          const verificationResult = await siweMessage.verify({
            signature: credentials.signature,
            nonce: nonce,
          });

          if (verificationResult.success) {
            const user: AuthUser = {
              id: verificationResult.data.address,
              accessToken: "Ox1010",
              walletAddress: verificationResult.data.address,
            };
            return user;
          }
          
          return null;

        } catch (error) {
          console.error("Authorize try-catch hatası:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'accessToken' in user && 'walletAddress' in user) {
        token.accessToken = user.accessToken as string;
        token.walletAddress = user.walletAddress as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.walletAddress = token.walletAddress as string;
      }
      return session;
    },
  },
  cookies: { /* ... */ },
  events: {},
};
// TypeScript tip tanımlamaları (Bunlar doğru ve gerekli)
declare module "next-auth" {
  interface User {
    accessToken: string;
    walletAddress: string;
  }

  interface Session {
    accessToken: string;
    user: {
      walletAddress: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    walletAddress: string;
  }
}