// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

// The main change is here: we wrap the NextAuth handler.
// This makes `req.session` available in the `authorize` function in `authConfig`.
export default withIronSessionApiRoute(async function auth(req, res) {
  // We need to pass the original req and res objects to NextAuth
  // And also add the req object to the authConfig so we can access it inside
  return await NextAuth(req, res, {
    ...authConfig,
    callbacks: {
        ...authConfig.callbacks,
        // The req object needs to be available to the authorize function
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id
                token.walletAddress = user.walletAddress
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
              session.user.walletAddress = token.walletAddress as string;
            }
            return session;
          },
    }
  });
}, sessionOptions);