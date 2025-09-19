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
          console.error("Missing credentials: 'message' or 'signature' was not provided.");
          return null;
        }

        try {
          const siweMessage = new SiweMessage(credentials.message);
          
          // CHANGE: Manually read cookie from headers
          const parsedCookies = cookie.parse(req.headers?.cookie || "");
          const nonce = parsedCookies["siwe-nonce"];
          // -----------------------------------------------------------------

          if (!nonce) {
            // Add a more descriptive log
            console.error("Nonce cookie not found in 'req.headers.cookie'.");
            throw new Error("Nonce cookie not found.");
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
          console.error("Authorize try-catch error:", error);
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
// TypeScript type declarations (correct and required)
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
