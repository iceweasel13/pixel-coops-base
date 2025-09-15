// src/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";
import { SiweMessage } from "siwe";
import { IronSession } from "iron-session";

// This is a helper type for the request object
interface AuthorizeRequest extends Request {
    session: IronSession;
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        // The 'req' object is now available here because we passed it in [...nextauth].ts
        const ironSession = (req as unknown as AuthorizeRequest).session;

        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));

          if (!ironSession.nonce) {
            console.error("Nonce not found in session.");
            return null;
          }
          if (siwe.nonce !== ironSession.nonce) {
             console.error("Invalid nonce in session.");
            return null;
          }

          await siwe.verify({ signature: credentials?.signature || "" });
          
          // Clear the nonce after successful verification
          ironSession.nonce = undefined;
          await ironSession.save();

          return {
            id: siwe.address,
            walletAddress: siwe.address,
          } as User;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Callbacks are now defined in the [...nextauth].ts wrapper
  },
};

// Update your type declarations slightly
declare module "next-auth" {
    interface User {
      walletAddress?: string;
    }
  
    interface Session {
      user?: {
        walletAddress?: string;
      } & Omit<User, "id">;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        walletAddress?: string
    }
}